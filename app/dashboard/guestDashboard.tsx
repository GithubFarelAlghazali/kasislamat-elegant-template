"use client";

import { useState, useMemo } from "react";
import { brideInfo } from "../helpers/data";
import { FaWhatsapp, FaTimes, FaEye, FaFilter } from "react-icons/fa";
import updateWaSend from "./updateWaSend";
import type { Guest } from "../helpers/sheetActions";

type FilterType = "semua" | "belum_dikirim" | "dikirim" | "hadir" | "absen";

const sendWaInvitation = async (
  guestId: string,
  guestName: string,
  guestPhone: string,
) => {
  const url = "https://example.kasislamat.my.id/";
  const message = `Assalamualaikum Warahmatullahi Wabarakatuh

Kepada Yth. ${guestName}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami :

${brideInfo.man.nickname} & ${brideInfo.woman.nickname}

Berikut link undangan kami, untuk info lengkap dari acara bisa kunjungi :

${url + guestId}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.

Terima kasih banyak atas perhatiannya.

Wassalamualaikum Warahmatullahi Wabarakatuh

Hormat kami,

${brideInfo.man.nickname} & ${brideInfo.woman.nickname}`;

  window.open(
    `https://wa.me/${guestPhone}?text=${encodeURIComponent(message)}`,
    "_blank",
  );

  await updateWaSend(guestId);
};

export default function GuestDashboardClient({
  guestList,
}: {
  guestList: Guest[];
}) {
  const [filter, setFilter] = useState<FilterType>("semua");

  // Filter guest list dynamically
  const filteredGuests = useMemo(() => {
    return guestList.filter((guest: Guest) => {
      if (filter === "belum_dikirim") {
        return guest.invitationStatus !== "dikirim";
      }
      if (filter === "dikirim") {
        return guest.invitationStatus === "dikirim";
      }
      return true;
    });
  }, [filter, guestList]);

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: "semua", label: "Semua" },
    { id: "belum_dikirim", label: "Belum Dikirim" },
    { id: "dikirim", label: "Dikirim" },
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 p-4 sm:p-6 md:p-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-5 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-taupe-800 tracking-tight">
              Kelola Tamu Undangan
            </h1>
          </div>
          <div className="text-xs text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 self-start sm:self-auto shadow-sm">
            Menampilkan:{" "}
            <span className="font-semibold text-taupe-800">
              {filteredGuests.length}
            </span>{" "}
            / {guestList.length} Tamu
          </div>
        </header>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-stone-400 mr-1 shrink-0">
            <FaFilter className="w-3 h-3" />
            <span>Filter:</span>
          </div>
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-taupe-800 text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100/70"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGuests.length === 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400 text-xs sm:text-sm">
            Tidak ada tamu dengan status ini.
          </div>
        )}

        {/* Mobile View: Card List (visible below md breakpoint) */}
        {filteredGuests.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredGuests.map((guest: Guest, idx: number) => (
              <div
                key={guest.id || idx}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400">
                      #{idx + 1}
                    </span>
                    <h3 className="font-medium text-stone-900 text-sm">
                      {guest.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      {guest.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
                  {guest.invitationStatus === "dikirim" ? (
                    <span className="inline-flex items-center px-3 py-1.5 text-xs text-stone-400 bg-stone-100 rounded-lg border border-stone-200/60">
                      Terkirim
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        sendWaInvitation(guest.id, guest.name, guest.phone)
                      }
                      className="inline-flex items-center gap-1.5 bg-taupe-800 hover:bg-taupe-800/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kirim WA</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop View: Table (hidden below md breakpoint) */}
        {filteredGuests.length > 0 && (
          <div className="hidden md:block bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100/70 border-b border-stone-200 text-taupe-800 font-medium uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 text-center">No.</th>
                    <th className="py-3.5 px-4">Nama Tamu</th>
                    <th className="py-3.5 px-4">No. Telp</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredGuests.map((guest: Guest, idx: number) => {
                    return (
                      <tr
                        key={guest.id || idx}
                        className="hover:bg-stone-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-center text-stone-400 font-mono text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-900">
                          {guest.name}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-mono text-xs">
                          {guest.phone}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {guest.invitationStatus === "dikirim" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-stone-400 bg-stone-100 rounded-md border border-stone-200/60">
                                Terkirim
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  sendWaInvitation(
                                    guest.id,
                                    guest.name,
                                    guest.phone,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 bg-taupe-800 hover:bg-taupe-800/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95"
                              >
                                <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Kirim</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
