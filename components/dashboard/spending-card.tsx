
"use client";
import React from "react";
import Image from "next/image";

export function SpendingLimitCard() {
    return (
        <div className="bg-surface rounded-[30px] p-6 flex flex-col items-center text-center relative overflow-hidden h-full min-h-[250px]">
            <div className="absolute top-0 right-0 p-4">
                <span className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded-lg">45%</span>
            </div>

            {/* 3D Illustration */}
            <div className="relative w-32 h-32 mb-4 hover:scale-110 transition-transform duration-500">
                <Image
                    src="/images/hero-3d.png"
                    alt="Spending Limit"
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
            </div>

            <div className="w-full mt-auto">
                <h4 className="text-muted text-sm font-medium mb-1">Spending Limit</h4>
                <h3 className="text-2xl font-bold text-white mb-4">$42,000</h3>

                {/* Custom Range Slider */}
                <div className="relative w-full h-2 bg-[#13151D] rounded-full">
                    <div className="absolute left-0 top-0 h-full w-[45%] bg-gradient-to-r from-secondary to-pink-500 rounded-full" />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="45"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
