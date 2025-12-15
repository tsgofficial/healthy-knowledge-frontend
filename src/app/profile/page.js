"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { getUser, removeToken, isAuthenticated } from "../utils/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    const userData = getUser();
    setUser(
      userData || {
        firstname: "Alex",
        lastname: "Sharma",
        email: "user@example.com",
      }
    );
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

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

  // Mock stats
  const stats = [
    { label: "Асуусан асуулт", value: 12 },
    { label: "Өгсөн хариулт", value: 87 },
    { label: "Нэр хүндийн оноо", value: 2450 },
  ];

  const badges = [
    { title: "First Aid Pro", desc: "Анхны тусламжийн зөвлөгөө өгсөн." },
    {
      title: "Community Contributor",
      desc: "Идэвхтэй оролцоо, тусламж өгсөн.",
    },
    { title: "Insightful Answer", desc: "5+ саналаар үнэлэгдсэн хариулт." },
    {
      title: "Verified Practitioner",
      desc: "Мэргэжлийн баримт бичиг баталгаажсан.",
    },
    { title: "Problem Solver", desc: "Асуултын хариулт нь сонгогдсон." },
    {
      title: "Topic Expert: Cardiology",
      desc: "Зүрх судасны чиглэлээр мэргэжилтэн.",
    },
  ];

  const askedQuestions = [
    {
      title: "Sudden sharp chest pain after exercise?",
      description:
        "I experienced a sudden, sharp pain in my chest, specifically on the left side, right after a vigorous cardio session. It lasted about 10 minutes and subsided. Should I be concerned?",
      tags: ["cardiology", "chest-pain", "exercise", "symptoms"],
      votes: 15,
      answers: 3,
      views: 240,
      askedOn: "2023-10-26",
    },
    {
      title: "Persistent fatigue and muscle weakness",
      description:
        "For the past two months, I've been feeling extremely tired, even after a full night's sleep. I also notice significant muscle weakness, especially in my arms and legs. What could this indicate?",
      tags: ["fatigue", "muscle-weakness", "diagnosis", "general-health"],
      votes: 8,
      answers: 2,
      views: 180,
      askedOn: "2023-09-15",
    },
    {
      title: "Rash spreading rapidly on arm, itchy and red",
      description:
        "Woke up with a small red patch on my forearm which has now spread significantly within 24 hours. It's very itchy and raised. No new foods or detergents used. Any ideas?",
      tags: ["dermatology", "rash", "skin-irritation", "allergies"],
      votes: 5,
      answers: 1,
      views: 120,
      askedOn: "2023-08-01",
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
                className="text-sm text-primary font-medium transition-colors"
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

      {/* Profile Hero */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-black/10 flex items-center justify-center text-xl font-semibold">
            {user?.firstname?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">
                Dr. {user?.firstname || "Alex"} {user?.lastname || "Sharma"}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                ✓ Баталгаажсан
              </span>
            </div>
            <p className="mt-2 text-black/70 max-w-3xl">
              Generally Practitioner, чиглэл: оношилгоо, урьдчилан сэргийлэх
              эрүүл мэнд. Эмнэлзүйн нотолгоонд тулгуурласан, тодорхой зөвлөгөө
              өгч ажилладаг.
            </p>
            <div className="mt-3">
              <button className="px-4 py-2 border border-black/10 rounded-md text-sm hover:bg-black/5 transition-colors">
                Профайл засах
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border border-black/10 rounded-lg p-5"
            >
              <p className="text-sm text-black/60">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Медаль</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div
                key={b.title}
                className="border border-black/10 rounded-lg p-4"
              >
                <p className="text-sm font-medium">{b.title}</p>
                <p className="text-xs text-black/60 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 border-b border-black/10 flex gap-6">
          <button className="pb-3 text-sm font-medium text-primary border-b-2 border-primary">
            Асуусан асуултууд
          </button>
          <button className="pb-3 text-sm font-medium text-black/60 hover:text-black">
            Өгсөн хариултууд
          </button>
        </div>

        {/* Asked Questions List */}
        <div className="mt-6 space-y-4">
          {askedQuestions.map((q, idx) => (
            <div key={idx} className="border border-black/10 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                {q.title}
              </h3>
              <p className="text-sm text-black/60 mb-3">{q.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {q.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-black/5 text-xs rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-black/60">
                <div className="flex items-center gap-4">
                  <span>👍 {q.votes} санал</span>
                  <span>💬 {q.answers} хариулт</span>
                  <span>👁 {q.views} үзэлт</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Асуусан огноо:</span>
                  <span>{q.askedOn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
