"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

interface HoloCardProps {
    children: React.ReactNode;
    className?: string;
    type?: "fire" | "water" | "grass" | "electric" | "psychic" | "default";
}

const TYPE_COLORS = {
    fire: { from: "from-orange-500", to: "to-red-600", shadow: "shadow-orange-500/20" },
    water: { from: "from-blue-400", to: "to-blue-600", shadow: "shadow-blue-500/20" },
    grass: { from: "from-green-400", to: "to-emerald-600", shadow: "shadow-green-500/20" },
    electric: { from: "from-yellow-300", to: "to-yellow-500", shadow: "shadow-yellow-500/20" },
    psychic: { from: "from-purple-400", to: "to-pink-600", shadow: "shadow-purple-500/20" },
    default: { from: "from-vision-blue", to: "to-vision-cyan", shadow: "shadow-vision-blue/20" },
};

export function HoloCard({ children, className = "", type = "default" }: HoloCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position values (0 to 1)
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    // Smooth springs for rotation
    const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Normalize coordinates (0 to 1)
        const xPct = clientX / rect.width;
        const yPct = clientY / rect.height;

        x.set(xPct);
        y.set(yPct);

        // Calculate rotation (max +/- 10 degrees)
        const rotX = (yPct - 0.5) * 20; // Tilt up/down
        const rotY = (xPct - 0.5) * -20; // Tilt left/right

        rotateX.set(rotX);
        rotateY.set(rotY);
    }

    function onMouseLeave() {
        setIsHovered(false);
        rotateX.set(0);
        rotateY.set(0);
    }

    // Dynamic gradient position
    const gradientX = useSpring(x, { stiffness: 200, damping: 30 });
    const gradientY = useSpring(y, { stiffness: 200, damping: 30 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={onMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative group rounded-xl transition-all duration-300 ${className} ${isHovered ? 'z-10 scale-[1.02]' : 'z-0'}`}
        >
            {/* Content Layer */}
            <div className="relative h-full w-full rounded-xl bg-vision-navy/40 backdrop-blur-xl border border-white/10 overflow-hidden transform-gpu">
                {children}

                {/* Holographic Sheen Overlay */}
                <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                    style={{
                        background: useMotionTemplate`
              linear-gradient(
                115deg,
                transparent 0%,
                rgba(255, 255, 255, 0.4) ${useMotionTemplate`calc(${gradientX} * 100%)`},
                rgba(255, 255, 255, 0.7) ${useMotionTemplate`calc(${gradientX} * 100% + 5%)`},
                rgba(255, 255, 255, 0.4) ${useMotionTemplate`calc(${gradientX} * 100% + 10%)`},
                transparent 100%
              )
            `,
                        mixBlendMode: "overlay",
                    }}
                />

                {/* Dynamic Type Glow Border */}
                <div
                    className={`absolute inset-0 rounded-xl border opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none ${TYPE_COLORS[type].shadow} shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)]`}
                    style={{ borderWidth: '1px', borderColor: 'transparent' }}
                />

                {/* Subtler Rainbow Noise (Holo Foil Texture) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none mix-blend-color-dodge bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover" />
            </div>
        </motion.div>
    );
}
