import { describe, it, expect } from 'vitest';
import { BENDER_PROFILES } from '../registry';

describe('BENDER_PROFILES registry', () => {
  it('has TheLastCodeBender at index 0', () => {
    expect(BENDER_PROFILES[0].handle).toBe('TheLastCodeBender');
  });

  it('marks index 0 as isFounder', () => {
    expect(BENDER_PROFILES[0].isFounder).toBe(true);
  });

  it('isFounder is true only on index 0', () => {
    const founderEntries = BENDER_PROFILES.filter((p) => p.isFounder === true);
    expect(founderEntries).toHaveLength(1);
    expect(founderEntries[0].handle).toBe('TheLastCodeBender');
  });

  it('no entry has handle codebender-profile-placeholder', () => {
    const placeholder = BENDER_PROFILES.find(
      (p) => p.handle === 'codebender-profile-placeholder',
    );
    expect(placeholder).toBeUndefined();
  });

  it('all entries have a non-empty handle', () => {
    for (const profile of BENDER_PROFILES) {
      expect(profile.handle).toBeTruthy();
    }
  });

  it('all entries have a valid discipline', () => {
    const validDisciplines = new Set([
      'founder',
      'frontend',
      'backend',
      'fullstack',
      'security',
      'ai',
      'devops',
    ]);
    for (const profile of BENDER_PROFILES) {
      expect(validDisciplines.has(profile.discipline)).toBe(true);
    }
  });

  it('claimed entries (non-founder, non-placeholder) have a non-empty github', () => {
    const claimed = BENDER_PROFILES.filter((p) => !p.isFounder && !p.isPlaceholder);
    for (const profile of claimed) {
      expect(profile.github).toBeTruthy();
    }
  });
});
