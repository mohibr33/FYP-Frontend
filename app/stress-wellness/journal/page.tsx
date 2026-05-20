"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  ArrowLeft,
  Users,
  MessageCircle,
  Heart,
  Send,
  Trash2,
  Plus,
} from "lucide-react";
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  addComment,
  deleteComment,
  toggleReaction,
  getCommunityStats,
} from "@/lib/api/community";
import type { CommunityPost, CommunityComment, CommunityStats } from "@/lib/types";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "", label: "All posts" },
  { value: "stress", label: "Stress" },
  { value: "anxiety", label: "Anxiety" },
  { value: "studies", label: "Studies" },
  { value: "work_pressure", label: "Work" },
  { value: "general", label: "General" },
];

const REACTIONS = [
  { type: "supportive", icon: "❤️", label: "Supportive" },
  { type: "empathetic", icon: "💗", label: "Empathetic" },
  { type: "grateful", icon: "🙏", label: "Grateful" },
  { type: "hopeful", icon: "🌟", label: "Hopeful" },
  { type: "thoughtful", icon: "💭", label: "Thoughtful" },
  { type: "encouraging", icon: "💪", label: "Encouraging" },
];

function CommentItem({
  comment,
  currentUserId,
  postId,
  replyTo,
  onReply,
  onDelete,
  onSubmit,
  commentText,
  onCommentTextChange,
  sendingComment,
  commentAnonymous,
  onToggleAnonymous,
  depth,
}: {
  comment: CommunityComment;
  currentUserId: string;
  postId: string;
  replyTo: { id: string; author: string } | null;
  onReply: (r: { id: string; author: string } | null) => void;
  onDelete: (id: string) => void;
  onSubmit: (parentId?: string) => void;
  commentText: string;
  onCommentTextChange: (v: string) => void;
  sendingComment: boolean;
  commentAnonymous: boolean;
  onToggleAnonymous: (v: boolean) => void;
  depth: number;
}) {
  const isReplying = replyTo?.id === comment.id;
  return (
    <div className={depth > 0 ? "ml-5 pl-4 border-l border-slate-200" : ""}>
      <div className="py-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {comment.isAnonymous ? "Anonymous" : "Member"}
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReply(isReplying ? null : { id: comment.id, author: comment.isAnonymous ? "Anonymous" : "Member" })}
              className="text-xs text-slate-400 hover:text-slate-700 font-medium"
            >
              Reply
            </button>
            {comment.userId === currentUserId && (
              <button onClick={() => onDelete(comment.id)} className="text-slate-300 hover:text-red-500">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
      </div>

      {isReplying && (
        <div className="mb-3 pl-3">
          <p className="text-xs text-slate-400 mb-2">
            Replying to <span className="font-medium text-slate-600">{replyTo.author}</span>
          </p>
          <div className="flex gap-2">
            <Textarea
              placeholder="Write a reply..."
              value={commentText}
              onChange={(e) => onCommentTextChange(e.target.value)}
              className="min-h-[40px] text-sm flex-1 bg-slate-50 border-slate-200"
            />
            <div className="flex flex-col gap-1.5">
              <Button
                size="sm"
                onClick={() => onSubmit(comment.id)}
                disabled={!commentText.trim() || sendingComment}
                className="bg-black hover:bg-slate-700 text-white h-9"
              >
                {sendingComment ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              </Button>
              <label className="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
                <Switch checked={commentAnonymous} onCheckedChange={onToggleAnonymous} className="scale-75" />
                Anon
              </label>
            </div>
          </div>
          <button onClick={() => onReply(null)} className="text-xs text-slate-400 hover:text-slate-600 mt-1">
            Cancel reply
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              postId={postId}
              replyTo={replyTo}
              onReply={onReply}
              onDelete={onDelete}
              onSubmit={onSubmit}
              commentText={replyTo?.id === reply.id ? commentText : ""}
              onCommentTextChange={replyTo?.id === reply.id ? onCommentTextChange : () => {}}
              sendingComment={sendingComment}
              commentAnonymous={commentAnonymous}
              onToggleAnonymous={onToggleAnonymous}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newIsAnonymous, setNewIsAnonymous] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(true);
  const [sendingComment, setSendingComment] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const [postsRes, statsRes] = await Promise.all([
        getPosts({ category: category || undefined, page: pageNum, limit: 10, search: undefined }),
        getCommunityStats(),
      ]);
      if (postsRes.success && postsRes.data) {
        setPosts(postsRes.data.posts);
        setTotalPages(postsRes.data.totalPages);
        setPage(postsRes.data.page);
      }
      if (statsRes.success) setStats(statsRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, category, fetchData]);

  const handleCreatePost = async () => {
    if (!newContent.trim()) return;
    try {
      setSaving(true);
      const res = await createPost({
        title: newTitle || undefined,
        content: newContent,
        category: newCategory,
        isAnonymous: newIsAnonymous,
      });
      if (res.success) {
        toast.success("Post shared!");
        setNewTitle("");
        setNewContent("");
        setShowNewPost(false);
        fetchData();
      } else {
        toast.error(res.message || "Failed to create post");
      }
    } catch {
      toast.error("Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      toast.success("Post deleted");
      setSelectedPost(null);
      fetchData();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleAddComment = async (postId: string, parentId?: string) => {
    if (!commentText.trim()) return;
    try {
      setSendingComment(true);
      const res = await addComment(postId, { content: commentText, isAnonymous: commentAnonymous, parentId });
      if (res.success) {
        toast.success(parentId ? "Reply added" : "Comment added");
        setCommentText("");
        setReplyTo(null);
        const refreshed = await getPostById(postId);
        if (refreshed.success && refreshed.data) setSelectedPost(refreshed.data);
        fetchData();
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSendingComment(false);
    }
  };

  const handleReaction = async (postId: string, reaction: string) => {
    try {
      await toggleReaction(postId, reaction);
      if (selectedPost?.id === postId) {
        const refreshed = await getPostById(postId);
        if (refreshed.success && refreshed.data) setSelectedPost(refreshed.data);
      }
      fetchData();
    } catch {
      toast.error("Failed to react");
    }
  };

  const openPost = async (postId: string) => {
    try {
      const res = await getPostById(postId);
      if (res.success && res.data) setSelectedPost(res.data);
    } catch {
      // silent
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Back link */}
        <button onClick={() => router.push("/stress-wellness")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Wellness
        </button>

        {/* Header */}
        <div className="bg-black rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Anonymous Community</h1>
              <p className="text-sm text-slate-400 mt-0.5">Share, support, and connect with others anonymously</p>
            </div>
          </div>
        </div>

        {selectedPost ? (
          /* ─── Post Detail View ─── */
          <div className="space-y-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 text-xs font-normal">
                      {CATEGORIES.find((c) => c.value === selectedPost.category)?.label || selectedPost.category}
                    </Badge>
                    {selectedPost.isAnonymous && (
                      <span className="text-xs text-slate-400">Anonymous</span>
                    )}
                  </div>
                  <button onClick={() => setSelectedPost(null)} className="text-xs text-slate-400 hover:text-slate-700">
                    Back
                  </button>
                </div>
                <CardTitle className="text-base text-slate-800">{selectedPost.title || "Untitled"}</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </div>

                {/* Reactions */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {REACTIONS.map((r) => {
                    const isActive = selectedPost.userReaction === r.type;
                    return (
                      <button
                        key={r.type}
                        onClick={() => handleReaction(selectedPost.id, r.type)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                          isActive
                            ? "bg-red-50 text-red-500 ring-1 ring-red-200"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                        title={r.label}
                      >
                        <span className={isActive ? "scale-110" : ""}>{r.icon}</span>
                      </button>
                    );
                  })}
                  <span className="text-xs text-slate-400 ml-1 flex items-center gap-1">
                    <span className={selectedPost.userReaction ? "text-red-400" : ""}>❤️</span>
                    {selectedPost.reactionCount}
                  </span>
                </div>

                {/* Delete */}
                {selectedPost.userId === user.id && (
                  <button onClick={() => handleDeletePost(selectedPost.id)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete post
                  </button>
                )}

                {/* Comments */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" /> Comments {selectedPost.commentCount > 0 && `(${selectedPost.commentCount})`}
                  </h4>

                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {selectedPost.comments.map((c) => (
                        <CommentItem
                          key={c.id}
                          comment={c}
                          currentUserId={user.id}
                          postId={selectedPost.id}
                          replyTo={replyTo}
                          onReply={setReplyTo}
                          onDelete={(id) => deleteComment(id).then(() => {
                            fetchData();
                            getPostById(selectedPost.id).then(r => r.success && r.data && setSelectedPost(r.data));
                          })}
                          onSubmit={(parentId) => handleAddComment(selectedPost.id, parentId)}
                          commentText={replyTo?.id === c.id ? commentText : ""}
                          onCommentTextChange={replyTo?.id === c.id ? setCommentText : () => {}}
                          sendingComment={sendingComment}
                          commentAnonymous={commentAnonymous}
                          onToggleAnonymous={setCommentAnonymous}
                          depth={0}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 py-3">No comments yet.</p>
                  )}

                  {!replyTo && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                      <Textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[40px] text-sm flex-1 bg-slate-50 border-slate-200"
                      />
                      <div className="flex flex-col gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(selectedPost.id)}
                          disabled={!commentText.trim() || sendingComment}
                          className="bg-black hover:bg-slate-700 text-white h-9"
                        >
                          {sendingComment ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        </Button>
                        <label className="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
                          <Switch checked={commentAnonymous} onCheckedChange={setCommentAnonymous} className="scale-75" />
                          Anon
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ─── List View ─── */
          <>
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Posts", value: stats.totalPosts, color: "bg-teal-500" },
                  { label: "Comments", value: stats.totalComments, color: "bg-blue-500" },
                  { label: "Reactions", value: stats.totalReactions, color: "bg-rose-500" },
                  { label: "My Posts", value: stats.myPosts, color: "bg-slate-700" },
                ].map((s) => (
                  <Card key={s.label} className="bg-white border-0 shadow-sm overflow-hidden">
                    <div className={`h-0.5 ${s.color}`} />
                    <CardContent className="py-3 text-center">
                      <p className="text-lg font-bold text-slate-800">{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Actions bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <Button
                  key={c.value}
                  variant={category === c.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setCategory(c.value); setPage(1); }}
                  className={category === c.value
                    ? "bg-black hover:bg-slate-700 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }
                >
                  {c.label}
                </Button>
              ))}
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={() => setShowNewPost(!showNewPost)}
                className="bg-black hover:bg-slate-700 text-white"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> New Post
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPost && (
              <Card className="bg-white border-0 shadow-sm overflow-hidden">
                <div className="h-0.5 bg-slate-700" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-700">Share your thoughts</CardTitle>
                  <CardDescription className="text-xs">Your identity stays protected — post anonymously</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="text-sm border-slate-200" />
                  <div className="flex gap-1.5 flex-wrap">
                    {CATEGORIES.filter((c) => c.value).map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setNewCategory(c.value)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                          newCategory === c.value
                            ? "bg-black text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="min-h-[120px] text-sm border-slate-200"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                      <Switch checked={newIsAnonymous} onCheckedChange={setNewIsAnonymous} />
                      Post anonymously
                    </label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)} className="border-slate-200 text-slate-600">
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleCreatePost} disabled={!newContent.trim() || saving} className="bg-black hover:bg-slate-700 text-white">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : posts.length === 0 ? (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No posts yet. Be the first to share!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openPost(post.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 text-xs font-normal">
                          {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                        </Badge>
                        {post.isAnonymous && <span className="text-xs text-slate-400">Anonymous</span>}
                        <span className="text-xs text-slate-400 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-sm text-slate-800">{post.title || "Untitled"}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1">{post.content}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-1 pb-3">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className={`flex items-center gap-1 ${post.userReaction ? "text-red-400" : ""}`}>
                          {post.userReaction ? "❤️" : <Heart className="w-3 h-3" />} {post.reactionCount}
                        </span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.commentCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center gap-1.5 pt-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchData(p)}
                        className={page === p
                          ? "bg-black hover:bg-slate-700 text-white min-w-[32px] h-8"
                          : "border-slate-200 text-slate-600 hover:bg-slate-100 min-w-[32px] h-8"
                        }
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
