import { Fragment, type CSSProperties } from "react";

const charBase = "inline-block leading-[1.2] [transition:transform_var(--character-duration)_ease]";
const outgoingChar = `${charBase} [transform:translateY(0)] group-hover/action:[transform:translateY(1.2em)] group-focus-visible/action:[transform:translateY(1.2em)] motion-reduce:[transform:none]!`;
const incomingChar = `${charBase} [transform:translateY(-1.2em)] before:content-[attr(data-character)] group-hover/action:[transform:translateY(0)] group-focus-visible/action:[transform:translateY(0)]`;
const rowClass = "block h-[1.2em] whitespace-nowrap [grid-area:1/1]";

export const fillButtonClasses =
  "relative overflow-hidden transition-colors before:absolute before:top-full before:left-1/2 before:aspect-square before:w-[150%] before:-translate-x-1/2 before:rounded-full before:transition-all before:duration-300 hover:before:top-1/2 hover:before:-translate-y-1/2";

function renderWords(text: string, incoming: boolean) {
  const words = text.split(" ");
  let position = 0;

  return words.map((word, wordIndex) => {
    const characters = Array.from(word).map((character) => {
      const duration = `${Math.min(0.2 + position * 0.05, 0.6)}s`;
      position += 1;
      return incoming ? (
        <span
          key={position}
          className={incomingChar}
          data-character={character}
          style={{ "--character-duration": duration } as CSSProperties}
        />
      ) : (
        <span
          key={position}
          className={outgoingChar}
          style={{ "--character-duration": duration } as CSSProperties}
        >
          {character}
        </span>
      );
    });
    position += 1;

    return (
      <Fragment key={`${word}-${wordIndex}`}>
        {wordIndex > 0 && " "}
        <span className="inline-block whitespace-nowrap">{characters}</span>
      </Fragment>
    );
  });
}

export function AnimatedButtonLabel({ text, className = "", variant = "roll" }: Readonly<{ text: string; className?: string; variant?: "roll" | "fill" }>) {
  if (variant === "fill") {
    return <span className={`relative z-10 ${className}`}>{text}</span>;
  }

  return (
    <span className={`relative inline-grid h-[1.2em] overflow-hidden text-center ${className}`}>
      <span className={rowClass}>{renderWords(text, false)}</span>
      <span className={`${rowClass} absolute inset-0 motion-reduce:hidden`} aria-hidden="true">
        {renderWords(text, true)}
      </span>
    </span>
  );
}
