"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, Search, Dumbbell, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Utensils, BookOpen, Activity, Heart, Brain, Bone, Zap, Sparkles, Clock,
  Flame, Target, TrendingUp, Star, ArrowRight, Play, FileText, AlertTriangle,
  Lock, Unlock, Footprints, Hand
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { updateProgress, getProgress, saveChecklist, getChecklist } from "@/lib/api/rehab";

const CATEGORIES = [
  { id: "knee", label: "Knee Rehabilitation", icon: Bone },
  { id: "back", label: "Back Pain Exercises", icon: Activity },
  { id: "shoulder", label: "Shoulder Recovery", icon: Heart },
  { id: "neck", label: "Neck Exercises", icon: Brain },
  { id: "post-surgery", label: "Post-Surgery Recovery", icon: Zap },
  { id: "ankle-foot", label: "Ankle & Foot", icon: Footprints },
  { id: "hip", label: "Hip Rehabilitation", icon: Activity },
  { id: "wrist-hand", label: "Wrist & Hand", icon: Hand },
  { id: "posture", label: "Posture Correction", icon: Star },
  { id: "elderly", label: "Elderly Mobility", icon: Heart },
];

const CAT_KEYS = CATEGORIES.map(c => c.id);

interface Exercise {
  id: string;
  name: string;
  category: typeof CAT_KEYS[number];
  youtubeId: string;
  description: string;
  steps: string[];
  reps: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  precautions: string[];
  order: number;
}

const EXERCISES: Exercise[] = [
  // ─── Knee Rehabilitation ────────────────────────────────────────────────
  { id: "knee-stretch", name: "Knee Stretch", category: "knee", youtubeId: "Rjojo8ysStQ", description: "Gentle knee extension stretch to improve range of motion after injury or surgery.", steps: ["Lie on your back with both legs extended", "Slowly bend your affected knee, sliding your foot toward your buttocks", "Hold the stretch for 5 seconds", "Slowly straighten your leg back to the starting position", "Repeat 10 times"], reps: "10 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Stop if you feel sharp pain", "Do not force the bend", "Keep movements slow and controlled"], order: 1 },
  { id: "hamstring-stretch", name: "Hamstring Stretch", category: "knee", youtubeId: "NkOwuoJCAuQ", description: "Hamstring flexibility exercise essential for knee rehabilitation and injury prevention.", steps: ["Sit on the floor with your affected leg extended", "Bend your other leg so the foot touches your inner thigh", "Slowly lean forward from your hips, keeping your back straight", "Reach toward your foot until you feel a gentle stretch", "Hold for 20-30 seconds"], reps: "3 reps", duration: "20-30 sec", difficulty: "Beginner", precautions: ["Avoid bouncing", "Keep back straight", "Stop if you feel pulling in your lower back"], order: 2 },
  { id: "quad-set", name: "Quadriceps Set", category: "knee", youtubeId: "xAzSOVuNgl4", description: "Isometric quadriceps strengthening exercise for early-stage knee rehabilitation.", steps: ["Lie on your back with your affected leg straight", "Tighten your thigh muscle by pushing your knee down into the floor", "Hold the contraction for 5 seconds", "Relax for 5 seconds", "Repeat 10-15 times"], reps: "10-15 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Breathe normally", "Do not hold your breath", "Keep your other leg relaxed"], order: 3 },
  { id: "heel-slide-knee", name: "Heel Slide", category: "knee", youtubeId: "0UmReiJ6Q0o", description: "Knee flexion exercise that gently restores bending motion after injury.", steps: ["Lie on your back with both knees bent", "Slowly slide your affected heel along the floor", "Go as far as comfortable", "Slide your heel back to starting position", "Repeat 10 times"], reps: "10 reps", duration: "2-3 sec each", difficulty: "Intermediate", precautions: ["Use a towel under your heel for smoother sliding", "Do not lift your hip"], order: 4 },
  // ─── Back Pain Exercises ────────────────────────────────────────────────
  { id: "cat-cow", name: "Cat-Cow Stretch", category: "back", youtubeId: "HeALuM1muR8", description: "Gentle spinal mobility exercise that helps relieve lower back pain and improve flexibility.", steps: ["Start on your hands and knees in a tabletop position", "Inhale as you arch your back (Cow pose)", "Exhale as you round your back (Cat pose)", "Move slowly between the two positions", "Repeat 10-12 times"], reps: "10-12 reps", duration: "3-5 sec each", difficulty: "Beginner", precautions: ["Move slowly", "Focus on breath coordination", "Keep wrists aligned under shoulders"], order: 1 },
  { id: "child-pose", name: "Child's Pose", category: "back", youtubeId: "WQHIBf-C-2w", description: "Restorative pose that gently stretches the lower back, hips, and thighs.", steps: ["Kneel on the floor with your big toes touching and knees hip-width apart", "Sit back on your heels and extend your arms forward", "Lower your chest toward the floor", "Rest your forehead on the mat", "Hold for 30 seconds to 1 minute"], reps: "2-3 reps", duration: "30-60 sec", difficulty: "Beginner", precautions: ["Place a pillow under knees if uncomfortable", "Do not force the stretch"], order: 2 },
  { id: "pelvic-tilt", name: "Pelvic Tilt", category: "back", youtubeId: "lTM8aIaebhE", description: "Core strengthening exercise that stabilizes the pelvis and alleviates lower back pain.", steps: ["Lie on your back with knees bent and feet flat on the floor", "Gently tilt your pelvis upward, pressing your lower back into the floor", "Hold for 5 seconds", "Release and return to neutral", "Repeat 10-15 times"], reps: "10-15 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Move slowly", "Engage your core", "Keep your upper body relaxed"], order: 3 },
  { id: "knee-to-chest", name: "Knee to Chest Stretch", category: "back", youtubeId: "WQHIBf-C-2w", description: "Lower back stretch that helps relieve tension and improve spinal mobility.", steps: ["Lie on your back with both knees bent", "Bring one knee toward your chest", "Hold for 20-30 seconds", "Return to start and switch sides", "Repeat 2-3 times each side"], reps: "2-3 reps each", duration: "20-30 sec", difficulty: "Beginner", precautions: ["Keep your other leg relaxed", "Do not force the knee", "Breathe deeply"], order: 4 },
  // ─── Shoulder Recovery ──────────────────────────────────────────────────
  { id: "shoulder-rotation", name: "Shoulder Rotation", category: "shoulder", youtubeId: "f3xvJAo7Tss", description: "Gentle shoulder mobility exercise to improve range of motion and reduce stiffness.", steps: ["Stand with your arms at your sides", "Slowly rotate your shoulders forward in a circular motion", "Complete 10 forward circles", "Reverse direction and complete 10 backward circles", "Keep the movement smooth and controlled"], reps: "10 each direction", duration: "Continuous", difficulty: "Beginner", precautions: ["Keep shoulders relaxed", "Do not hunch", "Stop if you feel pinching"], order: 1 },
  { id: "doorway-stretch", name: "Doorway Chest Stretch", category: "shoulder", youtubeId: "QVyMMFR6hec", description: "Effective pectoral and anterior shoulder stretch using a doorway for support.", steps: ["Stand in a doorway with your arms at 90 degrees on the doorframe", "Gently lean forward until you feel a stretch", "Hold for 20-30 seconds", "Step back and relax", "Repeat 2-3 times"], reps: "2-3 reps", duration: "20-30 sec", difficulty: "Beginner", precautions: ["Do not overstride", "Keep back straight", "Breathe deeply"], order: 2 },
  { id: "pendulum-swing", name: "Pendulum Swing", category: "shoulder", youtubeId: "Wz5IXboB7zM", description: "Codman's pendulum exercise for early shoulder rehabilitation after injury or surgery.", steps: ["Bend forward and support yourself with your non-affected arm on a table", "Let your affected arm hang down loosely", "Gently swing your arm in small circles clockwise", "After 10 circles, reverse direction", "Gradually increase circle size"], reps: "10 each direction", duration: "Continuous", difficulty: "Beginner", precautions: ["Keep arm completely relaxed", "Start with small circles", "Use your body to move the arm"], order: 3 },
  { id: "scapular-squeeze", name: "Scapular Squeeze", category: "shoulder", youtubeId: "QVyMMFR6hec", description: "Upper back strengthening exercise that improves shoulder blade control and posture.", steps: ["Stand or sit with good posture", "Squeeze your shoulder blades together", "Hold for 5 seconds", "Release completely", "Repeat 10-15 times"], reps: "10-15 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Do not shrug your shoulders", "Keep your neck relaxed", "Breathe normally"], order: 4 },
  // ─── Neck Exercises ─────────────────────────────────────────────────────
  { id: "neck-tilt", name: "Neck Tilt Exercise", category: "neck", youtubeId: "XtHfEI5DUE0", description: "Lateral neck stretch to relieve tension and improve cervical spine flexibility.", steps: ["Sit or stand with your spine straight and shoulders relaxed", "Slowly tilt your head toward your right shoulder", "Hold for 15-20 seconds", "Return to center, then tilt left", "Repeat 3-5 times each side"], reps: "3-5 each side", duration: "15-20 sec", difficulty: "Beginner", precautions: ["Do not lift your shoulder", "Keep movements slow", "Stop if you feel dizziness"], order: 1 },
  { id: "chin-tuck", name: "Chin Tuck", category: "neck", youtubeId: "Q12nIfVCpdU", description: "Deep neck flexor strengthening exercise that corrects forward head posture.", steps: ["Sit upright with shoulders relaxed", "Gently tuck your chin down toward your chest", "Keep your eyes forward", "Hold for 5 seconds", "Repeat 10 times"], reps: "10 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Do not force the movement", "Keep your chest lifted", "Breathe normally"], order: 2 },
  { id: "neck-rotation", name: "Neck Rotation", category: "neck", youtubeId: "MEcNEiPVhI4", description: "Cervical rotation exercise to improve neck mobility and reduce stiffness.", steps: ["Sit upright with shoulders relaxed", "Slowly turn your head to the right as far as comfortable", "Hold for 10-15 seconds", "Return to center, then turn left", "Repeat 5 times each side"], reps: "5 each side", duration: "10-15 sec", difficulty: "Beginner", precautions: ["Keep shoulders still", "Do not rotate beyond comfort", "Move slowly"], order: 3 },
  // ─── Post-Surgery Recovery ──────────────────────────────────────────────
  { id: "ankle-pump", name: "Ankle Pump", category: "post-surgery", youtubeId: "xmUc8sqgEoU", description: "Ankle pumping exercise to prevent DVT and maintain circulation after surgery.", steps: ["Lie on your back with legs extended", "Point your toes away from you", "Then pull your toes toward you", "Move continuously in a pumping motion", "Complete 20 pumps, rest, repeat"], reps: "20 pumps x2-3", duration: "Continuous", difficulty: "Beginner", precautions: ["Do not hold your breath", "Keep your leg relaxed", "Stop if you feel cramping"], order: 1 },
  { id: "straight-leg-raise", name: "Straight Leg Raise", category: "post-surgery", youtubeId: "BeeHf7yD0Q0", description: "Quadriceps and hip flexor strengthening essential for post-surgery recovery.", steps: ["Lie on your back with one knee bent and the other leg straight", "Tighten your thigh muscle of the straight leg", "Slowly lift your straight leg to the height of your bent knee", "Hold for 3-5 seconds", "Lower slowly and repeat 10 times"], reps: "10 reps", duration: "3-5 sec hold", difficulty: "Intermediate", precautions: ["Keep your core engaged", "Do not arch your back", "Lower your leg slowly"], order: 2 },
  { id: "heel-slide-post", name: "Heel Slide (Post-Op)", category: "post-surgery", youtubeId: "0UmReiJ6Q0o", description: "Gentle knee flexion for post-surgical range of motion recovery.", steps: ["Lie on your back with both knees bent", "Slowly slide your affected heel along the floor", "Go as far as comfortable", "Slide back to start", "Repeat 10 times"], reps: "10 reps", duration: "2-3 sec each", difficulty: "Intermediate", precautions: ["Use a towel under your heel", "Do not lift your hip", "Keep movement controlled"], order: 3 },
  // ─── Ankle & Foot ───────────────────────────────────────────────────────
  { id: "ankle-alphabet", name: "Ankle Alphabet", category: "ankle-foot", youtubeId: "xmUc8sqgEoU", description: "Trace the alphabet with your foot to improve ankle mobility and range of motion.", steps: ["Sit in a chair with your foot elevated", "Imagine your big toe is a pen", "Slowly trace each letter of the alphabet", "Use your entire foot and ankle to form the letters", "Repeat with the other foot"], reps: "Full alphabet", duration: "2-3 min", difficulty: "Beginner", precautions: ["Move slowly", "Do not force motion", "Stop if you feel sharp pain"], order: 1 },
  { id: "calf-raises", name: "Calf Raises", category: "ankle-foot", youtubeId: "NkOwuoJCAuQ", description: "Strengthens calf muscles and improves ankle stability for walking and balance.", steps: ["Stand with feet hip-width apart, holding a chair for support", "Slowly rise up onto your toes", "Hold at the top for 2 seconds", "Lower your heels back down", "Repeat 15-20 times"], reps: "15-20 reps", duration: "2 sec hold", difficulty: "Beginner", precautions: ["Hold onto a stable surface", "Keep your core engaged", "Move slowly and controlled"], order: 2 },
  { id: "towel-curls", name: "Towel Curls", category: "ankle-foot", youtubeId: "Rjojo8ysStQ", description: "Foot strengthening exercise that improves arch support and toe dexterity.", steps: ["Sit in a chair with a towel on the floor in front of you", "Place your foot on the towel", "Scrunch the towel toward you using only your toes", "Release and repeat", "Continue for 1-2 minutes"], reps: "1-2 min", duration: "Continuous", difficulty: "Beginner", precautions: ["Keep heel on the floor", "Do not rush the movement", "Use a small towel"], order: 3 },
  // ─── Hip Rehabilitation ─────────────────────────────────────────────────
  { id: "hip-bridge", name: "Glute Bridge", category: "hip", youtubeId: "xAzSOVuNgl4", description: "Strengthens glutes and hamstrings while stabilizing the pelvis and lower back.", steps: ["Lie on your back with knees bent and feet flat on the floor", "Push through your heels to lift your hips toward the ceiling", "Squeeze your glutes at the top", "Hold for 2-3 seconds", "Lower slowly and repeat 10-15 times"], reps: "10-15 reps", duration: "2-3 sec hold", difficulty: "Beginner", precautions: ["Keep your core engaged", "Do not arch your back", "Keep knees hip-width apart"], order: 1 },
  { id: "clamshell", name: "Clamshell Exercise", category: "hip", youtubeId: "BeeHf7yD0Q0", description: "Targets hip abductors and external rotators to improve hip stability.", steps: ["Lie on your side with legs bent at 45 degrees", "Keep your feet touching each other", "Lift your top knee while keeping feet together", "Hold for 2 seconds at the top", "Lower slowly and repeat 10-15 times per side"], reps: "10-15 each side", duration: "2 sec hold", difficulty: "Beginner", precautions: ["Do not rotate your pelvis", "Keep your hips stacked", "Move slowly and controlled"], order: 2 },
  { id: "hip-flexor-stretch", name: "Hip Flexor Stretch", category: "hip", youtubeId: "lTM8aIaebhE", description: "Stretches tight hip flexors that can contribute to lower back pain.", steps: ["Kneel on one knee with the other foot forward", "Push your hips forward gently", "Keep your upper body straight", "Hold for 20-30 seconds", "Switch sides and repeat"], reps: "2-3 reps each", duration: "20-30 sec", difficulty: "Beginner", precautions: ["Do not arch your lower back", "Keep your front knee above your ankle", "Breathe deeply"], order: 3 },
  // ─── Wrist & Hand ───────────────────────────────────────────────────────
  { id: "wrist-flexor-stretch", name: "Wrist Flexor Stretch", category: "wrist-hand", youtubeId: "XtHfEI5DUE0", description: "Stretches the forearm flexor muscles to relieve wrist and elbow tension.", steps: ["Extend your arm forward with palm facing up", "Use your other hand to gently pull your fingers back", "Hold for 15-20 seconds", "Switch arms and repeat", "Repeat 2-3 times each side"], reps: "2-3 each side", duration: "15-20 sec", difficulty: "Beginner", precautions: ["Do not overstretch", "Keep your elbow straight but not locked", "Stop if you feel sharp pain"], order: 1 },
  { id: "finger-spreads", name: "Finger Spreads", category: "wrist-hand", youtubeId: "XtHfEI5DUE0", description: "Improves finger dexterity and hand mobility after injury or surgery.", steps: ["Hold your hand out with fingers together", "Slowly spread your fingers as wide as possible", "Hold for 5 seconds", "Bring them back together", "Repeat 10-15 times"], reps: "10-15 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Move fingers slowly", "Do not force the stretch", "Keep your wrist relaxed"], order: 2 },
  { id: "grip-strength", name: "Grip Strengthening", category: "wrist-hand", youtubeId: "Q12nIfVCpdU", description: "Strengthens hand grip using a soft ball or putty for rehabilitation.", steps: ["Hold a soft ball or rolled towel in your palm", "Squeeze as hard as comfortably possible", "Hold the squeeze for 5 seconds", "Release completely", "Repeat 10-15 times per hand"], reps: "10-15 each hand", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Start with a soft ball", "Do not over-squeeze", "Rest between repetitions"], order: 3 },
  // ─── Posture Correction ─────────────────────────────────────────────────
  { id: "wall-posture", name: "Wall Posture Check", category: "posture", youtubeId: "MEcNEiPVhI4", description: "Teaches proper spinal alignment using a wall for feedback.", steps: ["Stand with your back against a wall", "Your heels should be 2-3 inches from the wall", "Press your lower back toward the wall", "Hold for 10 seconds while breathing deeply", "Step away and maintain the position"], reps: "5-10 reps", duration: "10 sec hold", difficulty: "Beginner", precautions: ["Keep your knees slightly bent", "Do not hold your breath", "Relax your shoulders"], order: 1 },
  { id: "shoulder-blade-squeeze", name: "Shoulder Blade Squeeze", category: "posture", youtubeId: "f3xvJAo7Tss", description: "Strengthens upper back muscles to correct rounded shoulder posture.", steps: ["Stand or sit with good posture", "Squeeze your shoulder blades together as if holding a pencil", "Hold for 5 seconds", "Release fully", "Repeat 10-15 times"], reps: "10-15 reps", duration: "5 sec hold", difficulty: "Beginner", precautions: ["Keep shoulders down (don't shrug)", "Keep your chin level", "Breathe normally"], order: 2 },
  { id: "thoracic-extension", name: "Thoracic Extension", category: "posture", youtubeId: "HeALuM1muR8", description: "Opens up the mid-back to counteract the effects of prolonged sitting.", steps: ["Sit on a chair with good posture", "Place your hands behind your head", "Gently arch your upper back over the back of the chair", "Look up slightly", "Hold for 5-10 seconds, repeat 5-8 times"], reps: "5-8 reps", duration: "5-10 sec", difficulty: "Intermediate", precautions: ["Do not strain your neck", "Keep your lower back stable", "Move slowly"], order: 3 },
  // ─── Elderly Mobility ────────────────────────────────────────────────────
  { id: "chair-stand", name: "Chair Stand", category: "elderly", youtubeId: "vcjlGrfwkyk", description: "Functional leg strengthening to improve the ability to stand from a chair safely.", steps: ["Sit on the edge of a sturdy chair with feet flat on the floor", "Cross your arms over your chest", "Lean forward slightly and stand up using your legs", "Pause briefly", "Slowly lower back to seated position", "Repeat 8-12 times"], reps: "8-12 reps", duration: "2-3 sec each", difficulty: "Beginner", precautions: ["Use a chair that will not slide or tip", "Keep your feet flat", "Use armrests if needed"], order: 1 },
  { id: "seated-marching", name: "Seated Marching", category: "elderly", youtubeId: "iL-swm4th_o", description: "Seated hip flexor exercise that helps with walking and stability.", steps: ["Sit upright in a sturdy chair", "Slowly lift your right knee toward your chest", "Lower your right foot back down", "Repeat with your left knee", "Alternate in a marching motion for 30-60 seconds"], reps: "30-60 sec", duration: "Continuous", difficulty: "Beginner", precautions: ["Hold the sides of the chair for balance", "Maintain good posture", "Stop if you feel dizzy"], order: 2 },
  { id: "heel-toe-raise", name: "Heel & Toe Raises", category: "elderly", youtubeId: "NkOwuoJCAuQ", description: "Ankle and calf strengthening that improves balance and prevents falls.", steps: ["Stand behind a sturdy chair holding the back for support", "Slowly rise up onto your toes", "Hold for 2 seconds", "Lower heels back down", "Then lift your toes upward keeping heels on the floor", "Alternate 10 times each"], reps: "10 each", duration: "2 sec hold", difficulty: "Beginner", precautions: ["Always hold onto the chair", "Keep feet hip-width apart", "Move slowly"], order: 3 },
  { id: "side-leg-raise-elderly", name: "Side Leg Raise", category: "elderly", youtubeId: "WQHIBf-C-2w", description: "Hip abductor strengthening to improve balance and walking stability.", steps: ["Stand behind a sturdy chair holding the back", "Slowly lift your right leg out to the side, keeping it straight", "Keep your toes pointing forward", "Lift only 6-12 inches", "Lower slowly", "Repeat 8-12 times, switch legs"], reps: "8-12 each leg", duration: "2-3 sec each", difficulty: "Beginner", precautions: ["Keep upper body still", "Do not lean to the opposite side", "Lift only as high as comfortable"], order: 4 },
];

const FAQS = [
  { q: "How often should I do these exercises?", a: "Most rehabilitation exercises should be performed 2-3 times daily for best results. However, follow your physiotherapist's specific recommendations as recovery timelines vary based on your condition and procedure." },
  { q: "What should I do if I feel pain during exercise?", a: "Mild discomfort is normal, but sharp or increasing pain is not. Stop immediately if you feel sharp pain. Apply ice for 15-20 minutes and consult your healthcare provider before continuing." },
  { q: "How long does recovery typically take?", a: "Recovery time varies widely depending on the type of injury or surgery, your overall health, and adherence to your rehabilitation program. Most soft tissue injuries take 4-12 weeks, while post-surgical recovery can take 3-6 months." },
  { q: "What is the flow lock system?", a: "Exercises are arranged in a specific order within each category. You must complete each exercise before the next one unlocks. This ensures you progress safely through your rehabilitation program in the correct sequence." },
  { q: "Can I exercise if I'm still swollen?", a: "Mild swelling is normal during recovery. Continue with gentle range-of-motion exercises but avoid strengthening exercises until swelling subsides. Always elevate and ice after exercise." },
  { q: "When can I return to sports or heavy activity?", a: "Return to sports should only occur when you have full range of motion, normal strength (90%+ compared to unaffected side), and no pain during activity. This typically requires clearance from your physiotherapist or surgeon." },
  { q: "Is it normal to hear clicking or popping?", a: "Occasional painless clicking or popping is common and usually not concerning. However, if accompanied by pain, locking, or giving way, consult your healthcare provider." },
  { q: "How do I maintain my recovery streak?", a: "Consistency is key. Set a daily reminder, start with just 5 minutes, and gradually increase. Tracking your progress and celebrating small wins helps maintain motivation." },
];

const DIET_RECOMMENDATIONS = [
  { title: "Protein-Rich Foods", description: "Essential for tissue repair and muscle recovery.", foods: ["Chicken breast", "Salmon", "Eggs", "Greek yogurt", "Lentils", "Tofu"], icon: "🥩" },
  { title: "Anti-Inflammatory Foods", description: "Help reduce swelling and promote healing.", foods: ["Berries", "Leafy greens", "Turmeric", "Ginger", "Green tea", "Avocado"], icon: "🫐" },
  { title: "Vitamin C & Collagen", description: "Crucial for wound healing and connective tissue repair.", foods: ["Citrus fruits", "Bell peppers", "Broccoli", "Bone broth", "Strawberries", "Kiwi"], icon: "🍊" },
  { title: "Calcium & Vitamin D", description: "Support bone healing and muscle function.", foods: ["Milk", "Cheese", "Fortified cereals", "Almonds", "Sardines"], icon: "🥛" },
  { title: "Zinc-Rich Foods", description: "Speeds up wound healing and supports immune function.", foods: ["Pumpkin seeds", "Chickpeas", "Beef", "Cashews", "Mushrooms"], icon: "🥜" },
  { title: "Hydration", description: "Critical for joint lubrication, nutrient transport, and waste removal.", foods: ["Water (8+ glasses)", "Coconut water", "Herbal teas", "Water-rich fruits"], icon: "💧" },
];

const DAILY_CHECKLIST_ITEMS = [
  { id: "meds", label: "Take prescribed medications" },
  { id: "ice", label: "Apply ice/heat therapy" },
  { id: "stretch", label: "Morning stretching routine" },
  { id: "exercise", label: "Complete rehab exercises" },
  { id: "walk", label: "Short walk (5-10 minutes)" },
  { id: "elevate", label: "Elevate affected area" },
  { id: "hydration", label: "Drink 8 glasses of water" },
  { id: "protein", label: "High-protein meal" },
  { id: "rest", label: "Take adequate rest breaks" },
  { id: "journal", label: "Log pain & progress" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-slate-100 text-slate-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

const getTodayDate = () => new Date().toISOString().split("T")[0];

function YouTubeEmbed({ videoId, title, locked }: { videoId: string; title: string; locked: boolean }) {
  return (
    <div className="relative w-full aspect-video bg-slate-100 rounded-t-xl overflow-hidden group">
      {locked ? (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">Complete previous exercise first</p>
          </div>
        </div>
      ) : null}
      <iframe
        src={locked ? undefined : `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

function ExerciseProgressBar({ completed, total, label, color }: { completed: number; total: number; label?: string; color?: string }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={cn(completed >= total ? "text-emerald-500 font-medium" : "text-slate-500")}>{label || `${completed}/${total}`}</span>
        <span className={cn("font-medium", completed >= total ? "text-emerald-500" : "text-slate-700")}>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color || (completed >= total ? "bg-emerald-400" : "bg-emerald-400"))}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function RehabPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [completedHistory, setCompletedHistory] = useState<string[]>([]);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [checklistItems, setChecklistItems] = useState(DAILY_CHECKLIST_ITEMS.map(i => ({ ...i, completed: false })));
  const [progressLoading, setProgressLoading] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [completingExercise, setCompletingExercise] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const checklistLoadedRef = useRef(false);

  useEffect(() => {
    if (user && !localStorage.getItem("rehab-disclaimer-dismissed")) {
      setShowDisclaimer(true);
    }
  }, [user]);

  // ─── Filtered & ordered exercises ──────────────────────────────────────
  const filteredExercises = useMemo(() => {
    let exs = [...EXERCISES];
    if (activeCategory !== "all") {
      exs = exs.filter((e) => e.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      exs = exs.filter(
        (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.steps.some((s) => s.toLowerCase().includes(q))
      );
    }
    return exs.sort((a, b) => a.order - b.order);
  }, [activeCategory, searchQuery]);

  // ─── Per-category progress ─────────────────────────────────────────────
  const categoryProgress = useMemo(() => {
    const map: Record<string, { completed: number; total: number }> = {};
    CATEGORIES.forEach(c => {
      const catExs = EXERCISES.filter(e => e.category === c.id).sort((a, b) => a.order - b.order);
      const done = catExs.filter(e => completedExercises.has(e.id)).length;
      map[c.id] = { completed: done, total: catExs.length };
    });
    return map;
  }, [completedExercises]);

  // ─── Overall stats ─────────────────────────────────────────────────────
  const totalCompleted = completedExercises.size;
  const totalExercises = EXERCISES.length;
  const overallPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
  const checklistCompleted = checklistItems.filter((i) => i.completed).length;

  const recentlyCompleted = useMemo(() => {
    return completedHistory.slice(0, 4).map(id => EXERCISES.find(e => e.id === id)).filter(Boolean) as Exercise[];
  }, [completedHistory]);

  const recommendedExercises = useMemo(() => {
    const incomplete = EXERCISES.filter(e => !completedExercises.has(e.id));
    const byCategory: Record<string, Exercise[]> = {};
    incomplete.forEach(e => {
      if (!byCategory[e.category]) byCategory[e.category] = [];
      byCategory[e.category].push(e);
    });
    return Object.values(byCategory).flatMap(arr => arr.slice(0, 1)).slice(0, 4);
  }, [completedExercises]);

  // ─── Flow lock: determine if an exercise is accessible ─────────────────
  const getExerciseStatus = useCallback((exercise: Exercise): "locked" | "available" | "completed" => {
    if (completedExercises.has(exercise.id)) return "completed";
    const catExs = EXERCISES.filter(e => e.category === exercise.category).sort((a, b) => a.order - b.order);
    const idx = catExs.findIndex(e => e.id === exercise.id);
    if (idx === 0) return "available";
    const prevCompleted = catExs.slice(0, idx).every(e => completedExercises.has(e.id));
    return prevCompleted ? "available" : "locked";
  }, [completedExercises]);

  const isLocked = useCallback((exercise: Exercise): boolean => {
    return getExerciseStatus(exercise) === "locked";
  }, [getExerciseStatus]);

  const isCurrentExercise = useCallback((exercise: Exercise): boolean => {
    return getExerciseStatus(exercise) === "available";
  }, [getExerciseStatus]);

  // ─── Data loading ──────────────────────────────────────────────────────
  useEffect(() => {
    if (user) loadProgress();
  }, [user]);

  const loadProgress = async () => {
    try {
      setProgressLoading(true);
      const today = getTodayDate();
      const [progressRes, checklistRes] = await Promise.all([
        getProgress(),
        getChecklist(today),
      ]);
      if (progressRes.success && progressRes.data) {
        const completed = new Set<string>();
        const history: string[] = [];
        const dates = new Set<string>();
        progressRes.data.forEach((p: any) => {
          completed.add(p.exerciseId);
          history.push(p.exerciseId);
          if (p.lastCompletedAt) {
            dates.add(new Date(p.lastCompletedAt).toISOString().split("T")[0]);
          }
        });
        setCompletedExercises(completed);
        setCompletedHistory(history);
        // Calculate date-based streak
        const sorted = Array.from(dates).sort().reverse();
        let streak = 0;
        if (sorted.length > 0) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          if (sorted[0] === today || sorted[0] === yesterday) {
            streak = 1;
            for (let i = 1; i < sorted.length; i++) {
              const prev = new Date(sorted[i - 1]);
              const curr = new Date(sorted[i]);
              const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
              if (diff === 1) streak++;
              else break;
            }
          }
        }
        setStreakDays(streak);
      }
      if (checklistRes.success && checklistRes.data?.items) {
        setChecklistItems(checklistRes.data.items);
        checklistLoadedRef.current = true;
      }
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  // ─── Debounced checklist save ──────────────────────────────────────
  useEffect(() => {
    if (!user || !checklistLoadedRef.current) return;
    const timer = setTimeout(() => {
      saveChecklist(getTodayDate(), checklistItems).catch((err) =>
        console.error("Failed to save checklist:", err)
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [checklistItems, user]);

  const handleMarkCompleted = async (exerciseId: string) => {
    if (completingExercise) return;
    setCompletingExercise(exerciseId);
    setCompletedExercises(prev => {
      const next = new Set(prev);
      next.add(exerciseId);
      return next;
    });
    setCompletedHistory(prev => [exerciseId, ...prev]);
    setStreakDays(prev => Math.max(prev, 1));
    try {
      await updateProgress(exerciseId);
      toast.success("Exercise completed! Next exercise is now unlocked.");
    } catch (err) {
      setCompletedExercises(prev => {
        const next = new Set(prev);
        next.delete(exerciseId);
        return next;
      });
      setCompletedHistory(prev => prev.filter(id => id !== exerciseId));
      toast.error(getErrorMessage(err));
    } finally {
      setCompletingExercise(null);
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklistItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const activeCategoryInfo = CATEGORIES.find(c => c.id === activeCategory);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* ─── Disclaimer Popup ─── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowDisclaimer(false); localStorage.setItem("rehab-disclaimer-dismissed", "true"); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-amber-500 p-4 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-white shrink-0" />
                <h2 className="text-lg font-bold text-white">Medical Disclaimer</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  This platform provides health, physiotherapy, and wellness information for educational and supportive purposes only. It is <strong className="text-slate-800">not a substitute for professional medical advice, diagnosis, or treatment</strong>.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Always consult a qualified doctor or physiotherapist before starting any exercise or medical plan.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>In case of emergency or severe symptoms, seek immediate medical help.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Stop any exercise immediately if you feel sharp pain or discomfort.</span>
                  </div>
                </div>
                <Button
                  onClick={() => { setShowDisclaimer(false); localStorage.setItem("rehab-disclaimer-dismissed", "true"); }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl"
                >
                  I Understand
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden rounded-2xl bg-black p-8 md:p-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/[0.02] rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm text-white/80 mb-5">
                <Sparkles className="w-4 h-4" />
                Physiotherapy Exercise Guide
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                Rehab & Recovery
                <span className="block text-slate-400">Exercise Guide</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 max-w-xl leading-relaxed">
                Video-guided physiotherapy exercises with sequential flow-lock progression and recovery tracking.
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <Flame className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streakDays}</p>
                <p className="text-xs text-slate-500">Day Streak</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Stats Dashboard ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: CheckCircle2, label: "Exercises Done", value: `${totalCompleted}/${totalExercises}`, color: "text-emerald-500", border: "border-emerald-200" },
            { icon: Flame, label: "Day Streak", value: `${streakDays} days`, color: "text-amber-600", border: "border-amber-200" },
            { icon: Target, label: "Overall Progress", value: `${overallPct}%`, color: "text-emerald-500", border: "border-emerald-200" },
            { icon: TrendingUp, label: "Checklist", value: `${checklistCompleted}/${checklistItems.length}`, color: "text-emerald-500", border: "border-emerald-200" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl bg-white border flex items-center justify-center", s.border)}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Overall Progress Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Overall Recovery Progress</h3>
            <span className="text-sm font-medium text-emerald-500">{overallPct}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </motion.div>

        {/* ─── Main Tabs ─── */}
        <Tabs defaultValue="exercises" className="w-full">
          <TabsList className="bg-white border border-slate-200 rounded-xl p-1 w-full justify-start overflow-x-auto shadow-sm">
            <TabsTrigger value="exercises" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-lg gap-2">
              <Play className="w-4 h-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="checklist" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-lg gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-lg gap-2">
              <BookOpen className="w-4 h-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="diet" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-lg gap-2">
              <Utensils className="w-4 h-4" />
              Diet
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════════════════════════════
              EXERCISES TAB
          ════════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="exercises" className="space-y-6 mt-6">
            {/* Recommended Exercises */}
            {recommendedExercises.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h3 className="font-semibold text-slate-800">Recommended Next Exercises</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedExercises.map((ex) => (
                    <motion.button
                      key={ex.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => { setActiveCategory(ex.category); setExpandedExercise(ex.id); }}
                      className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-sm text-slate-800">{ex.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{ex.duration}</p>
                      <Badge className={cn("text-[10px] px-2 py-0.5 border-0 font-medium mt-2", DIFFICULTY_COLORS[ex.difficulty])}>
                        {ex.difficulty}
                      </Badge>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recently Completed */}
            {recentlyCompleted.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-slate-800">Recently Completed</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {recentlyCompleted.map((ex) => (
                    <Badge key={ex.id} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 text-xs gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {ex.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Category Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const cp = categoryProgress[cat.id];
                if (!cp) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "rounded-xl p-3 border text-left transition-all",
                      activeCategory === cat.id
                        ? "bg-black text-white border-black"
                        : "bg-white border-slate-200 hover:border-slate-400 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <cat.icon className="w-4 h-4" />
                      <span className="text-xs font-medium truncate">{cat.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", activeCategory === cat.id ? "bg-white" : "bg-emerald-400")}
                        style={{ width: `${cp.total > 0 ? (cp.completed / cp.total) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] mt-1 opacity-70">{cp.completed}/{cp.total} done</p>
                  </button>
                );
              })}
            </div>

            {/* Search + Category Filter */}
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-slate-200 rounded-xl"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory("all")}
                    className={activeCategory === "all" ? "bg-black hover:bg-black/80 text-white rounded-full" : "border-slate-200 text-slate-600 hover:text-black rounded-full"}
                  >
                    All Categories
                  </Button>
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={activeCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`gap-1.5 rounded-full ${
                        activeCategory === cat.id
                          ? "bg-black hover:bg-black/80 text-white"
                          : "border-slate-200 text-slate-600 hover:text-black"
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exercise Cards */}
            {progressLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-black/60" />
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No exercises found. Try a different search or category.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {filteredExercises.map((exercise, i) => {
                    const status = getExerciseStatus(exercise);
                    const completed = status === "completed";
                    const locked = status === "locked";
                    const current = status === "available";
                    const isExpanded = expandedExercise === exercise.id;
                    const Icon = CATEGORIES.find((c) => c.id === exercise.category)?.icon || Activity;
                    return (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        layout
                      >
                        <Card className={cn(
                          "group border shadow-sm transition-all duration-300 overflow-hidden",
                          completed ? "border-emerald-200 bg-emerald-50/30" : locked ? "border-slate-200 opacity-70" : "border-slate-200 hover:shadow-md",
                        )}>
                          <div className={cn("h-1", completed ? "bg-emerald-400" : locked ? "bg-slate-200" : "bg-emerald-400")} />
                          <div className="flex flex-col md:flex-row">
                            {/* Video (left side) */}
                            <div className="md:w-80 shrink-0">
                              <YouTubeEmbed videoId={exercise.youtubeId} title={exercise.name} locked={locked} />
                              {/* Per-exercise progress bar UNDER the video */}
                              <div className="px-3 pb-3 pt-2">
                                <ExerciseProgressBar
                                  completed={completed ? 1 : 0}
                                  total={1}
                                  label={completed ? "Completed" : "Not completed"}
                                />
                              </div>
                            </div>

                            {/* Content (right side) */}
                            <CardContent className="p-4 flex-1 flex flex-col gap-2 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                      <Icon className="w-3 h-3 text-slate-600" />
                                    </div>
                                    <h3 className="font-semibold text-slate-800 text-base truncate">{exercise.name}</h3>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={cn("text-[10px] px-2 py-0.5 border-0 font-medium", DIFFICULTY_COLORS[exercise.difficulty])}>
                                      {exercise.difficulty}
                                    </Badge>
                                    <Badge className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 border-0">
                                      Step {exercise.order}
                                    </Badge>
                                    {completed && (
                                      <Badge className="bg-emerald-400 text-white text-[10px] px-2 py-0.5 border-0 font-medium">
                                        ✓ Done
                                      </Badge>
                                    )}
                                    {current && !completed && (
                                      <Badge className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 border-0 font-medium">
                                        Current
                                      </Badge>
                                    )}
                                    {locked && (
                                      <Badge className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 border-0 font-medium">
                                        <Lock className="w-3 h-3 mr-0.5 inline" /> Locked
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{exercise.description}</p>

                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5" />{exercise.reps}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exercise.duration}</span>
                              </div>

                              {/* Expandable Steps */}
                              <div className="space-y-1 flex-1">
                                <button
                                  onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-black transition-colors"
                                >
                                  {isExpanded ? "Hide instructions" : "View instructions"}
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <ol className="space-y-1 list-decimal list-inside text-xs text-slate-600">
                                        {exercise.steps.map((step, si) => <li key={si}>{step}</li>)}
                                      </ol>
                                      {exercise.precautions.length > 0 && (
                                        <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                          <p className="text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wide">Precautions</p>
                                          <ul className="space-y-0.5">
                                            {exercise.precautions.map((p, pi) => (
                                              <li key={pi} className="text-[10px] text-slate-600 flex items-start gap-1">
                                                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                                <span>{p}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <Button
                                size="sm"
                                variant={completed ? "outline" : "default"}
                                disabled={locked || completingExercise === exercise.id}
                                className={cn(
                                  "w-full rounded-lg gap-2 transition-all mt-auto",
                                  completed
                                    ? "border-emerald-200 text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                                    : locked
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-emerald-400 hover:bg-emerald-500 text-white shadow-sm"
                                )}
                                onClick={() => handleMarkCompleted(exercise.id)}
                              >
                                {completingExercise === exercise.id ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : completed ? (
                                  <><CheckCircle2 className="w-4 h-4" /> Completed</>
                                ) : locked ? (
                                  <><Lock className="w-4 h-4" /> Locked</>
                                ) : (
                                  <><Unlock className="w-4 h-4" /> Mark as Completed</>
                                )}
                              </Button>
                            </CardContent>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════════════
              CHECKLIST TAB
          ════════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="checklist" className="space-y-6 mt-6">
            <Card className="border border-slate-200 shadow-sm">
              <div className="h-1 bg-emerald-400" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Daily Recovery Checklist
                    </CardTitle>
                    <CardDescription>Track your daily recovery activities</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500">{checklistCompleted}/{checklistItems.length}</p>
                    <p className="text-xs text-slate-500">completed today</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(checklistCompleted / checklistItems.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {checklistItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleChecklist(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left",
                        item.completed
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-white border border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                      <span className={cn("text-sm", item.completed ? "text-emerald-600 line-through" : "text-slate-700")}>
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════════════
              FAQS TAB
          ════════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="faqs" className="space-y-6 mt-6">
            <Card className="border border-slate-200 shadow-sm">
              <div className="h-1 bg-black" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <BookOpen className="w-5 h-5 text-black" />
                  Recovery FAQs
                </CardTitle>
                <CardDescription>Common questions about rehabilitation and recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FAQS.map((faq) => {
                    const isOpen = expandedFaq === faq.q;
                    return (
                      <div key={faq.q} className="rounded-xl border border-slate-200 overflow-hidden transition-all">
                        <button
                          onClick={() => setExpandedFaq(isOpen ? null : faq.q)}
                          className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-sm text-slate-800 pr-4">{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-black shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed bg-slate-50/50">{faq.a}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════════════
              DIET TAB
          ════════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="diet" className="space-y-6 mt-6">
            <Card className="border border-slate-200 shadow-sm">
              <div className="h-1 bg-black" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Utensils className="w-5 h-5 text-black" />
                  Post-Surgery Diet Recommendations
                </CardTitle>
                <CardDescription>Nutrition guidance to support healing and recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DIET_RECOMMENDATIONS.map((item) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h3 className="font-semibold text-slate-800 text-sm mb-1.5">{item.title}</h3>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.foods.map((food) => (
                          <span key={food} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {food}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm bg-slate-50">
              <div className="h-1 bg-black" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Sparkles className="w-5 h-5 text-black" />
                  Quick Recovery Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: "😴", title: "Rest", desc: "Prioritize 7-9 hours of quality sleep for tissue repair" },
                    { icon: "💧", title: "Hydrate", desc: "Drink at least 8 glasses of water daily" },
                    { icon: "🥗", title: "Eat Smart", desc: "Focus on protein, vitamins, and anti-inflammatory foods" },
                    { icon: "👨‍⚕️", title: "Follow Up", desc: "Attend all scheduled physiotherapy appointments" },
                  ].map((tip) => (
                    <div key={tip.title} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                      <span className="text-2xl block mb-2">{tip.icon}</span>
                      <h4 className="font-semibold text-sm text-slate-800 mb-0.5">{tip.title}</h4>
                      <p className="text-xs text-slate-500">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ─── Disclaimer ─── */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500 leading-relaxed space-y-1">
              <p className="font-semibold text-slate-700 text-sm">Medical Disclaimer</p>
              <p>
                This platform provides health, physiotherapy, and wellness information for educational and
                supportive purposes only. It is not a substitute for professional medical advice, diagnosis, or
                treatment. Always consult a qualified doctor or physiotherapist before starting any exercise or
                medical plan. In case of emergency or severe symptoms, seek immediate medical help.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
