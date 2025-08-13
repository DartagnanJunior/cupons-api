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
    };
  }
}
