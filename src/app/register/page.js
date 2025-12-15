"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: form.firstName,
          lastname: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If server returns token, store it and redirect
        if (data.token) {
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          setMessage("Амжилттай бүртгэгдлээ! Шилжүүлж байна...");
          setTimeout(() => {
            router.push("/questions");
          }, 500);
        } else {
          // Otherwise redirect to login
          setMessage(
            "Амжилттай бүртгэгдлээ! Нэвтрэх хуудас руу шилжүүлж байна..."
          );
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      } else {
        setMessage(data.message || "Бүртгэл амжилтгүй боллоо.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Серверт холбогдож чадсангүй.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white gap-8">
      <div className="flex justify-center">
        <Image
          src={logo}
          alt="Logo"
          width={400}
          height={400}
          priority
          className="w-auto h-40"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(52%) sepia(98%) saturate(1827%) hue-rotate(192deg) brightness(100%) contrast(93%)",
          }}
        />
      </div>
      <div className="w-full max-w-md bg-white border border-black/10 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Бүртгүүлэх</h1>
        <p className="text-sm text-black/60 mb-6">Мэдээллээ оруулж эхлээрэй.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm mb-1">
                Нэр
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={onChange}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm mb-1">
                Овог
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={onChange}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              И-мэйл
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Нууц үг
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-md bg-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Уншиж байна..." : "Бүртгүүлэх"}
          </button>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-emerald-600">{message}</p>
        ) : null}

        <p className="mt-6 text-sm text-black/60">
          Бүртгэлтэй юу?{" "}
          <Link className="underline hover:opacity-80" href="/login">
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}
