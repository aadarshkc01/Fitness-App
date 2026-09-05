import { useEffect, useState } from 'react';

const DRAFT_KEY = 'intake-draft-v1';

export function useIntakeDraft<T>(initial: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? { ...initial, ...JSON.parse(saved) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, [data]);

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  return { data, setData, clearDraft };
}
