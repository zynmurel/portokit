"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import * as React from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

const variantsMap = {
  up: fadeUpVariants,
  right: fadeRightVariants,
  left: fadeLeftVariants,
  fade: fadeVariants,
  scale: scaleVariants,
} as const;

export type FadeDirection = keyof typeof variantsMap;

function useTimedVariants(
  direction: FadeDirection,
  delay?: number,
  duration?: number,
): Variants {
  const base = variantsMap[direction];
  return React.useMemo<Variants>(() => {
    if (delay === undefined && duration === undefined) return base;
    const visible = base.visible as { transition?: Record<string, unknown> };
    return {
      ...base,
      visible: {
        ...(visible as object),
        transition: {
          ...(visible?.transition ?? {}),
          duration: duration ?? 0.7,
          delay: delay ?? 0,
          ease: EASE,
        },
      },
    };
  }, [base, delay, duration]);
}

type FadeInBaseProps = {
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

export function FadeIn({
  direction = "up",
  delay,
  duration,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: HTMLMotionProps<"div"> & FadeInBaseProps) {
  const variants = useTimedVariants(direction, delay, duration);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function FadeInSection({
  direction = "up",
  delay,
  duration,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: HTMLMotionProps<"section"> & FadeInBaseProps) {
  const variants = useTimedVariants(direction, delay, duration);
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

type StaggerBaseProps = {
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
  amount?: number;
};

function useStaggerVariants(
  delayChildren: number,
  staggerChildren: number,
): Variants {
  return React.useMemo<Variants>(
    () => ({
      hidden: {},
      visible: {
        transition: { delayChildren, staggerChildren },
      },
    }),
    [delayChildren, staggerChildren],
  );
}

export function Stagger({
  delayChildren = 0.1,
  staggerChildren = 0.08,
  once = true,
  amount = 0.15,
  children,
  ...rest
}: HTMLMotionProps<"div"> & StaggerBaseProps) {
  const variants = useStaggerVariants(delayChildren, staggerChildren);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerUl({
  delayChildren = 0.1,
  staggerChildren = 0.08,
  once = true,
  amount = 0.15,
  children,
  ...rest
}: HTMLMotionProps<"ul"> & StaggerBaseProps) {
  const variants = useStaggerVariants(delayChildren, staggerChildren);
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerOl({
  delayChildren = 0.1,
  staggerChildren = 0.08,
  once = true,
  amount = 0.15,
  children,
  ...rest
}: HTMLMotionProps<"ol"> & StaggerBaseProps) {
  const variants = useStaggerVariants(delayChildren, staggerChildren);
  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.ol>
  );
}

type StaggerItemBase = { direction?: FadeDirection };

export function StaggerItem({
  direction = "up",
  children,
  ...rest
}: HTMLMotionProps<"div"> & StaggerItemBase) {
  const variants = variantsMap[direction];
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}

export function StaggerItemLi({
  direction = "up",
  children,
  ...rest
}: HTMLMotionProps<"li"> & StaggerItemBase) {
  const variants = variantsMap[direction];
  return (
    <motion.li variants={variants} {...rest}>
      {children}
    </motion.li>
  );
}

export function StaggerItemArticle({
  direction = "up",
  children,
  ...rest
}: HTMLMotionProps<"article"> & StaggerItemBase) {
  const variants = variantsMap[direction];
  return (
    <motion.article variants={variants} {...rest}>
      {children}
    </motion.article>
  );
}

export function SlideDownHeader({
  duration = 0.6,
  delay = 0,
  children,
  ...rest
}: HTMLMotionProps<"header"> & { duration?: number; delay?: number }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.header>
  );
}
