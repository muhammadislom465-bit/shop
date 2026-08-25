import React from 'react';

const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-xl ${className}`}>
    <div className="invisible">.</div>
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
    <Shimmer className="h-44 rounded-2xl mb-3" />
    <Shimmer className="h-3 w-3/4 mb-2" />
    <Shimmer className="h-3 w-1/2 mb-3" />
    <Shimmer className="h-4 w-1/3 mb-2" />
    <Shimmer className="h-3 w-2/3 mb-3" />
    <div className="flex gap-2">
      <Shimmer className="h-9 flex-1" />
      <Shimmer className="h-9 w-9" />
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-r from-purple-100 to-purple-50 rounded-3xl h-56 w-full" />
);

export const CategorySkeleton = () => (
  <div className="flex gap-3 overflow-hidden">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="flex-shrink-0 w-24">
        <Shimmer className="h-20 w-20 rounded-2xl mx-auto mb-2" />
        <Shimmer className="h-3 w-16 mx-auto" />
      </div>
    ))}
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
    <Shimmer className="h-40 w-full rounded-none" />
    <div className="p-5">
      <Shimmer className="h-3 w-1/4 mb-3" />
      <Shimmer className="h-4 w-3/4 mb-2" />
      <Shimmer className="h-3 w-full mb-1" />
      <Shimmer className="h-3 w-2/3" />
    </div>
  </div>
);

export const OrderSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 p-5">
    <div className="flex items-center justify-between mb-3">
      <Shimmer className="h-4 w-40" />
      <Shimmer className="h-6 w-24 rounded-full" />
    </div>
    <Shimmer className="h-3 w-1/3 mb-2" />
    <Shimmer className="h-3 w-1/2 mb-4" />
    <div className="space-y-2">
      <Shimmer className="h-10 w-full" />
      <Shimmer className="h-10 w-full" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-3xl border border-gray-100 p-6">
      <div className="flex items-center gap-4">
        <Shimmer className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Shimmer className="h-4 w-40 mb-2" />
          <Shimmer className="h-3 w-56" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Shimmer className="h-24 rounded-2xl" />
      <Shimmer className="h-24 rounded-2xl" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-2">
    <div className="flex gap-4 p-3">
      {[...Array(cols)].map((_, i) => (
        <Shimmer key={i} className="h-4 flex-1" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
        {[...Array(cols)].map((_, j) => (
          <Shimmer key={j} className="h-3 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 p-5 flex items-center justify-between">
    <div className="flex-1">
      <Shimmer className="h-3 w-24 mb-2" />
      <Shimmer className="h-6 w-32" />
    </div>
    <Shimmer className="h-12 w-12 rounded-2xl" />
  </div>
);

export const PageLoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-6">
      <Shimmer className="h-6 w-48" />
      <Shimmer className="h-9 w-32 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  </div>
);
