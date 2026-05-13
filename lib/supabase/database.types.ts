export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          quantity: number;
          selected_size: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          quantity?: number;
          selected_size: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          quantity?: number;
          selected_size?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          discount_type: Database["public"]["Enums"]["discount_type"];
          ends_at: string | null;
          id: string;
          is_active: boolean;
          maximum_discount_amount: number | null;
          minimum_order_amount: number;
          starts_at: string | null;
          updated_at: string;
          usage_count: number;
          usage_limit: number | null;
          value: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          discount_type: Database["public"]["Enums"]["discount_type"];
          ends_at?: string | null;
          id?: string;
          is_active?: boolean;
          maximum_discount_amount?: number | null;
          minimum_order_amount?: number;
          starts_at?: string | null;
          updated_at?: string;
          usage_count?: number;
          usage_limit?: number | null;
          value: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          discount_type?: Database["public"]["Enums"]["discount_type"];
          ends_at?: string | null;
          id?: string;
          is_active?: boolean;
          maximum_discount_amount?: number | null;
          minimum_order_amount?: number;
          starts_at?: string | null;
          updated_at?: string;
          usage_count?: number;
          usage_limit?: number | null;
          value?: number;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          order_id: string;
          price: number;
          product_id: string | null;
          product_name: string;
          product_sku: string | null;
          product_slug: string | null;
          quantity: number;
          selected_size: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          order_id: string;
          price: number;
          product_id?: string | null;
          product_name: string;
          product_sku?: string | null;
          product_slug?: string | null;
          quantity: number;
          selected_size: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          order_id?: string;
          price?: number;
          product_id?: string | null;
          product_name?: string;
          product_sku?: string | null;
          product_slug?: string | null;
          quantity?: number;
          selected_size?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          coupon_id: string | null;
          created_at: string;
          delivery_fee: number;
          discount_amount: number;
          email: string;
          full_name: string;
          id: string;
          inventory_released_at: string | null;
          notes: string | null;
          order_number: string;
          order_status: Database["public"]["Enums"]["order_status"];
          payment_status: Database["public"]["Enums"]["payment_status"];
          phone: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          shipping_address: Json;
          subtotal_amount: number;
          total_amount: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          coupon_id?: string | null;
          created_at?: string;
          delivery_fee?: number;
          discount_amount?: number;
          email: string;
          full_name: string;
          id?: string;
          inventory_released_at?: string | null;
          notes?: string | null;
          order_number: string;
          order_status?: Database["public"]["Enums"]["order_status"];
          payment_status?: Database["public"]["Enums"]["payment_status"];
          phone: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          shipping_address: Json;
          subtotal_amount: number;
          total_amount: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          coupon_id?: string | null;
          created_at?: string;
          delivery_fee?: number;
          discount_amount?: number;
          email?: string;
          full_name?: string;
          id?: string;
          inventory_released_at?: string | null;
          notes?: string | null;
          order_number?: string;
          order_status?: Database["public"]["Enums"]["order_status"];
          payment_status?: Database["public"]["Enums"]["payment_status"];
          phone?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          shipping_address?: Json;
          subtotal_amount?: number;
          total_amount?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey";
            columns: ["coupon_id"];
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_events: {
        Row: {
          created_at: string;
          event_id: string;
          event_type: string;
          id: string;
          payload: Json;
          provider: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          event_type: string;
          id?: string;
          payload: Json;
          provider?: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          event_type?: string;
          id?: string;
          payload?: Json;
          provider?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          id: string;
          order_id: string;
          provider: string;
          raw_response: Json;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          id?: string;
          order_id: string;
          provider?: string;
          raw_response?: Json;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          order_id?: string;
          provider?: string;
          raw_response?: Json;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt_text: string | null;
          created_at: string;
          display_order: number;
          id: string;
          image_url: string;
          is_primary: boolean;
          product_id: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          image_url: string;
          is_primary?: boolean;
          product_id: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          image_url?: string;
          is_primary?: boolean;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_sizes: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          quantity: number;
          size: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          quantity?: number;
          size: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          quantity?: number;
          size?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_tags: {
        Row: {
          id: number;
          product_id: string;
          tag: string;
        };
        Insert: {
          id?: number;
          product_id: string;
          tag: string;
        };
        Update: {
          id?: number;
          product_id?: string;
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          availability_status: Database["public"]["Enums"]["availability_status"];
          category_id: string | null;
          color: string;
          created_at: string;
          delivery_information: string;
          description: string;
          discounted_price: number | null;
          fabric: string;
          featured: boolean;
          id: string;
          is_active: boolean;
          name: string;
          popularity_score: number;
          price: number;
          return_policy: string;
          search_document: unknown;
          sku: string;
          slug: string;
          stock: number;
          updated_at: string;
        };
        Insert: {
          availability_status?: Database["public"]["Enums"]["availability_status"];
          category_id?: string | null;
          color: string;
          created_at?: string;
          delivery_information?: string;
          description: string;
          discounted_price?: number | null;
          fabric: string;
          featured?: boolean;
          id?: string;
          is_active?: boolean;
          name: string;
          popularity_score?: number;
          price: number;
          return_policy?: string;
          search_document?: unknown;
          sku: string;
          slug: string;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          availability_status?: Database["public"]["Enums"]["availability_status"];
          category_id?: string | null;
          color?: string;
          created_at?: string;
          delivery_information?: string;
          description?: string;
          discounted_price?: number | null;
          fabric?: string;
          featured?: boolean;
          id?: string;
          is_active?: boolean;
          name?: string;
          popularity_score?: number;
          price?: number;
          return_policy?: string;
          search_document?: unknown;
          sku?: string;
          slug?: string;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      recently_viewed_products: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          viewed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recently_viewed_products_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recently_viewed_products_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wishlist_items: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_pending_order: {
        Args: {
          p_coupon_id: string | null;
          p_delivery_fee: number;
          p_discount_amount: number;
          p_email: string;
          p_full_name: string;
          p_items: Json;
          p_order_number: string;
          p_phone: string;
          p_razorpay_order_id: string;
          p_shipping_address: Json;
          p_subtotal_amount: number;
          p_total_amount: number;
          p_user_id: string | null;
        };
        Returns: string;
      };
      is_admin: {
        Args: { user_id?: string | null };
        Returns: boolean;
      };
      mark_order_failed: {
        Args: { payment_payload?: Json; target_order_id: string };
        Returns: undefined;
      };
      mark_order_paid: {
        Args: {
          payment_payload?: Json;
          target_order_id: string;
          target_razorpay_payment_id: string;
        };
        Returns: undefined;
      };
      release_inventory_for_order: {
        Args: { target_order_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "customer" | "admin";
      availability_status: "in_stock" | "out_of_stock";
      discount_type: "percentage" | "flat";
      order_status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
      payment_status: "pending" | "paid" | "failed" | "refunded";
    };
    CompositeTypes: Record<string, never>;
  };
};
