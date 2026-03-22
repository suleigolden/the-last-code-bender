import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MINIMIZE_MS = 580;
type IDEWindowControlsProps = {
  url?: string;
};

export const IDEWindowControls = ({ url = "/hall-of-fame" }: IDEWindowControlsProps) => {
  const navigate = useNavigate();
  const minimizeLock = useRef(false);

  const handleWindowControlsClick = useCallback(() => {
    if (minimizeLock.current) return;
    minimizeLock.current = true;

    const finish = () => {
      document.documentElement.classList.remove("ide-minimize-exit");
      minimizeLock.current = false;
      navigate(url);
    };

    const root = document.getElementById("root");
    if (!root) {
      finish();
      return;
    }

    let done = false;

    const onAnimationEnd = (e: AnimationEvent) => {
      if (e.target !== root || e.animationName !== "ide-minimize-to-dock") return;
      safelyFinish();
    };

    const safelyFinish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(fallbackTimer);
      root.removeEventListener("animationend", onAnimationEnd);
      finish();
    };

    const fallbackTimer = window.setTimeout(safelyFinish, MINIMIZE_MS);

    root.addEventListener("animationend", onAnimationEnd);
    document.documentElement.classList.add("ide-minimize-exit");
  }, [navigate, url]);

  return (
    <div className="hidden md:flex items-center gap-2 px-4" role="group" aria-label="Window controls">
      <button
        type="button"
        onClick={handleWindowControlsClick}
        className="w-3 h-3 rounded-full bg-destructive/60 hover:bg-destructive/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors shrink-0"
        aria-label="Close window — go to Hall of Fame"
      />
      <button
        type="button"
        onClick={handleWindowControlsClick}
        className="w-3 h-3 rounded-full bg-syntax-function/60 hover:bg-syntax-function/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors shrink-0"
        aria-label="Minimize window — go to Hall of Fame"
      />
      <button
        type="button"
        onClick={handleWindowControlsClick}
        className="w-3 h-3 rounded-full bg-syntax-string/60 hover:bg-syntax-string/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors shrink-0"
        aria-label="Zoom window — go to Hall of Fame"
      />
    </div>
  );
};
