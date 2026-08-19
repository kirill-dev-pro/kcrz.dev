export type SceneMode = 'hero' | 'system' | 'projects';

export function resolveSceneMode(sectionId: string): SceneMode {
  if (sectionId === 'hero') return 'hero';
  if (sectionId === 'bunderstack') return 'system';
  return 'projects';
}

export function shouldAnimate(prefersReducedMotion: boolean, documentVisible: boolean): boolean {
  return !prefersReducedMotion && documentVisible;
}

export function initGardenState(root: HTMLElement): () => void {
  const documentElement = root.ownerDocument.documentElement;
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-scene-section]'));
  const projects = Array.from(root.querySelectorAll<HTMLElement>('[data-project-id]'));
  const listeners: Array<() => void> = [];

  const setScene = (sectionId: string) => {
    documentElement.dataset.scene = resolveSceneMode(sectionId);
  };

  const setProject = (projectId: string | undefined) => {
    if (projectId) documentElement.dataset.project = projectId;
    else delete documentElement.dataset.project;
  };

  if (!documentElement.dataset.scene) setScene('hero');

  let observer: IntersectionObserver | undefined;
  if (typeof IntersectionObserver !== 'undefined' && sections.length > 0) {
    observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setScene((visible.target as HTMLElement).dataset.sceneSection ?? 'hero');
    }, { threshold: [0.25, 0.5, 0.75] });
    sections.forEach((section) => observer?.observe(section));
  }

  const onPointerOver = (event: PointerEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-project-id]');
    if (target && root.contains(target)) setProject(target.dataset.projectId);
  };
  const onPointerOut = (event: PointerEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-project-id]');
    const related = event.relatedTarget as Node | null;
    if (target && root.contains(target) && (!related || !target.contains(related))) setProject(undefined);
  };
  const onFocusIn = (event: FocusEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-project-id]');
    if (target && root.contains(target)) setProject(target.dataset.projectId);
  };
  const onFocusOut = (event: FocusEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-project-id]');
    const related = event.relatedTarget as Node | null;
    if (target && root.contains(target) && (!related || !target.contains(related))) setProject(undefined);
  };

  root.addEventListener('pointerover', onPointerOver);
  root.addEventListener('pointerout', onPointerOut);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  listeners.push(
    () => root.removeEventListener('pointerover', onPointerOver),
    () => root.removeEventListener('pointerout', onPointerOut),
    () => root.removeEventListener('focusin', onFocusIn),
    () => root.removeEventListener('focusout', onFocusOut),
  );

  return () => {
    observer?.disconnect();
    listeners.forEach((remove) => remove());
  };
}
