import { env } from "./env/serve";

export const pppCoupons = [
  {
    stripeCouponId: env.STRIPE_PPP_50_COUPON_ID,
    discountPercentage: 0.5,
    countryCodes: ["TW", "US", "JP", "SG", "HK", "MY", "PH", "TH", "VN"],
  },
  {
    stripeCouponId: env.STRIPE_PPP_40_COUPON_ID,
    discountPercentage: 0.4,
    countryCodes: ["IN", "ID", "EG", "PK", "NG", "BD", "MA", "KE", "LK"],
  },
  {
    stripeCouponId: env.STRIPE_PPP_30_COUPON_ID,
    discountPercentage: 0.3,
    countryCodes: ["BR", "MX", "CO", "PE", "ZA", "UA", "EC", "DZ", "TN"],
  },
  {
    stripeCouponId: env.STRIPE_PPP_20_COUPON_ID,
    discountPercentage: 0.2,
    countryCodes: ["PL", "HU", "RO", "TR", "CL", "AR", "CR", "RS", "BG"],
  },
];
