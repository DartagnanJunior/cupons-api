import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: number;
      name: string;
      email: string;
      created_at: string;
    };

    coupon_books: {
      id: number;
      name: string;
      max_redemptions: number;
      max_codes_amount: number | null;
      generation_pattern: string | null;
      generation_amount: number | null;
      status: string;
      created_at: string;
      redeemed_codes_amount_per_user: number;
      assign_codes_amount_per_user: number;
    };

    codes: {
      id: number;
      coupon_book_id: number;
      code: string;
      created_at: string;
      redeemed_times: number;
      assigned_user_id: number | null;
      status: string;
    };
  }
}
