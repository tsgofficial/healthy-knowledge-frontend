"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import {
  getUser,
  removeToken,
  isAuthenticated,
  fetchWithAuth,
} from "../utils/auth";

export default function QuestionsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get user info (can be null if not stored)
    const userData = getUser();
    setUser(userData);
    setIsLoading(false);

    // Load questions
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError("");
        const res = await fetchWithAuth("http://localhost:5001/questions", {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          const items = Array.isArray(data)
            ? data
            : data.questions || data.data || [];
          setQuestions(items);
        } else {
          setQuestionsError(
            data.message || "Асуултуудыг татахад алдаа гарлаа."
          );
        }
      } catch (err) {
        setQuestionsError("Сервертэй холбогдож чадсангүй.");
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-black/60">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  const tags = [
    { name: "respiratory", count: 250 },
    { name: "back_pain", count: 180 },
    { name: "mental_health", count: 165 },
    { name: "nutrition", count: 210 },
    { name: "diabetes", count: 140 },
    { name: "women_health", count: 120 },
    { name: "diagnosis", count: 95 },
  ];

  // questions are fetched from backend

  const trendingQuestions = [
    {
      title: "Impact of screen time on eye health and simple...",
      answers: 14,
      views: 4200,
    },
    {
      title: "Managing anxiety attacks: grounding techniques and...",
      answers: 11,
      views: 3800,
    },
    {
      title: "Understanding vitamin deficiencies in vegetarian diets",
      answers: 11,
      views: 3500,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Health Overflow Logo"
                width={32}
                height={32}
                className="w-8 h-8"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(52%) sepia(98%) saturate(1827%) hue-rotate(192deg) brightness(100%) contrast(93%)",
                }}
              />
              <span className="text-lg font-semibold">Health Overflow</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/questions"
                className="text-sm hover:text-primary transition-colors"
              >
                Асуултууд
              </Link>
              <Link
                href="/ask"
                className="text-sm hover:text-primary transition-colors"
              >
                Асуулт асуух
              </Link>
              <Link
                href="/profile"
                className="text-sm hover:text-primary transition-colors"
              >
                Профайл
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Хайх..."
                className="w-64 pl-9 pr-3 py-2 border border-black/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {user?.firstname?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-black/10">
                  <p className="text-sm font-medium">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-black/60">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-black/5 transition-colors"
                >
                  Профайл
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Гарах
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-6 px-6 py-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          {/* Status Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Статус</h3>
            <div className="space-y-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                  statusFilter === "all"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-black/5"
                }`}
              >
                Бүх асуултууд
              </button>
              <button
                onClick={() => setStatusFilter("answered")}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                  statusFilter === "answered"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-black/5"
                }`}
              >
                Хариулсан
              </button>
              <button
                onClick={() => setStatusFilter("unanswered")}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                  statusFilter === "unanswered"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-black/5"
                }`}
              >
                Хариулаагүй
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Сэдэв</h3>
            <div className="space-y-2">
              {tags.map((tag) => (
                <label
                  key={tag.name}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-black/5 px-3 py-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, tag.name]);
                      } else {
                        setSelectedTags(
                          selectedTags.filter((t) => t !== tag.name)
                        );
                      }
                    }}
                    className="w-4 h-4 rounded border-black/20 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{tag.name}</span>
                  <span className="text-xs text-black/40">({tag.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Огноо</h3>
            <div className="space-y-2 text-sm">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-black/5 transition-colors">
                Сүүлийн 24 цаг
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-black/5 transition-colors">
                Сүүлийн 7 хоног
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-black/5 transition-colors">
                Сүүлийн сар
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-black/5 transition-colors">
                Сүүлийн жил
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Бүх асуултууд</h1>
            <Link
              href="/ask"
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Асуулт асуух
            </Link>
          </div>

          {/* Sort tabs */}
          <div className="flex gap-4 mb-6 border-b border-black/10">
            <button
              onClick={() => setSortBy("newest")}
              className={`pb-3 text-sm font-medium transition-colors ${
                sortBy === "newest"
                  ? "text-primary border-b-2 border-primary"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Шинэ
            </button>
            <button
              onClick={() => setSortBy("mostAnswers")}
              className={`pb-3 text-sm font-medium transition-colors ${
                sortBy === "mostAnswers"
                  ? "text-primary border-b-2 border-primary"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Хамгийн их хариулттай
            </button>
            <button
              onClick={() => setSortBy("mostViews")}
              className={`pb-3 text-sm font-medium transition-colors ${
                sortBy === "mostViews"
                  ? "text-primary border-b-2 border-primary"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Хамгийн их үзэлттэй
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questionsLoading && (
              <div className="text-sm text-black/60">
                Асуултуудыг уншиж байна...
              </div>
            )}
            {questionsError && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {questionsError}
              </div>
            )}
            {!questionsLoading && !questionsError && questions.length === 0 && (
              <div className="text-sm text-black/60">Асуулт олдсонгүй.</div>
            )}
            {!questionsLoading &&
              !questionsError &&
              questions.map((question) => (
                <div
                  key={question.id || question._id}
                  className="border border-black/10 rounded-lg p-5 hover:border-primary/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                    {question.title}
                  </h3>
                  {question.description && (
                    <p className="text-sm text-black/60 mb-3 line-clamp-2">
                      {question.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(question.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-black/5 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-black/60">
                    <div className="flex items-center gap-4">
                      {typeof question.answers !== "undefined" && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          {question.answers} Хариулт
                        </span>
                      )}
                      {typeof question.views !== "undefined" && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {question.views} Үзэлт
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {question.author && <span>{question.author}</span>}
                      {question.timeAgo && (
                        <>
                          <span>•</span>
                          <span>{question.timeAgo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-black/10 hover:bg-black/5 transition-colors">
              ‹
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-black/10 hover:bg-black/5 transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-black/10 hover:bg-black/5 transition-colors">
              ›
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 flex-shrink-0">
          {/* Trending Questions */}
          <div className="border border-black/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Эрэлттэй асуултууд</h3>
            <div className="space-y-4">
              {trendingQuestions.map((q, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium mb-2 hover:text-primary cursor-pointer transition-colors line-clamp-2">
                    {q.title}
                  </p>
                  <div className="flex gap-3 text-xs text-black/60">
                    <span>{q.answers} хариулт</span>
                    <span>{q.views} үзэлт</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="border border-black/10 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-semibold mb-4">Алдартай сэдэв</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "respiratory",
                "back_pain",
                "mental_health",
                "nutrition",
                "diabetes",
                "women_health",
                "diagnosis",
              ].map((tag) => (
                <Link
                  key={tag}
                  href={`/questions?tag=${tag}`}
                  className="px-3 py-1.5 bg-black/5 text-xs rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-black/60">
          <p>© 2025 Health Overflow. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Бидний тухай
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Нууцлалын бодлого
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Үйлчилгээний нөхцөл
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Холбоо барих
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
