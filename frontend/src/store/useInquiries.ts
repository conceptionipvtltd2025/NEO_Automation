import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

export type InquiryStatus = "new" | "read" | "responded" | "closed";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
  productId?: string;
  productName?: string;
  status: InquiryStatus;
  createdAt: number;
};

type InquiryState = {
  inquiries: Inquiry[];
  loaded: boolean;
  /** Load inquiries from the API (admin only — requires a valid token). */
  load: () => Promise<void>;
  addInquiry: (data: Omit<Inquiry, "id" | "status" | "createdAt">) => Inquiry;
  setStatus: (id: string, status: InquiryStatus) => void;
  remove: (id: string) => void;
};

const seed: Inquiry[] = [
  {
    id: "seed-1",
    name: "Rohan Mehta",
    email: "rohan@tatamotors.example",
    phone: "+91 98250 11223",
    address: "Sanand, Gujarat",
    message:
      "Interested in Tensor ES cordless nutrunners for our BIW line. Please share a quote for 12 units with SWF integration.",
    productId: "ac-tensor-es",
    productName: "Tensor ES Cordless Nutrunner",
    status: "new",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "seed-2",
    name: "Anita Sharma",
    email: "anita@hyperscale.example",
    phone: "+91 99099 44556",
    address: "Mumbai DC Campus",
    message:
      "Need John Guest Speedfit connectors for a liquid-cooling retrofit. Bulk pricing required.",
    productId: "jg-speedfit",
    productName: "Speedfit Push-Fit Connector Set",
    status: "read",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
  },
  {
    id: "seed-3",
    name: "Vikram Patel",
    email: "vikram@aeroworks.example",
    phone: "+91 90000 77889",
    message: "Looking for calibrated torque wrenches, AS9100 documentation.",
    productId: "gedore-torque",
    productName: "DREMASTER Torque Wrench",
    status: "responded",
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
  },
];

const sync = (p: Promise<unknown>) => {
  p.catch(() => {
    /* offline / unauthorized — optimistic local state already applied */
  });
};

export const useInquiries = create<InquiryState>()(
  persist(
    (set) => ({
      inquiries: seed,
      loaded: false,

      load: async () => {
        try {
          const inquiries = await api.get<Inquiry[]>("/inquiries");
          set({ inquiries, loaded: true });
        } catch {
          set({ loaded: true });
        }
      },

      addInquiry: (data) => {
        const inquiry: Inquiry = {
          ...data,
          id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          status: "new",
          createdAt: Date.now(),
        };
        set((s) => ({ inquiries: [inquiry, ...s.inquiries] }));
        // Persist to the backend; reconcile the optimistic row with the saved one.
        api
          .post<Inquiry>("/inquiries", data)
          .then((saved) => {
            if (saved?.id) {
              set((s) => ({
                inquiries: s.inquiries.map((i) => (i.id === inquiry.id ? saved : i)),
              }));
            }
          })
          .catch(() => {
            /* offline — keep the local optimistic inquiry */
          });
        return inquiry;
      },

      setStatus: (id, status) => {
        set((s) => ({
          inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
        }));
        sync(api.patch(`/inquiries/${id}/status`, { status }));
      },

      remove: (id) => {
        set((s) => ({ inquiries: s.inquiries.filter((i) => i.id !== id) }));
        sync(api.del(`/inquiries/${id}`));
      },
    }),
    { name: "neo-inquiries" }
  )
);
