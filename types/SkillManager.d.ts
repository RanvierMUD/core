import { Skill } from './Skill';

export declare class SkillManager {
  constructor();

  /**
   * @param {string} skill Skill name
   * @return {Skill|undefined}
   */
  get(skill: Skill): Skill | undefined;

  /**
   * @param {Skill} skill
   */
  add(skill: Skill): void;

  /**
   * @param {Skill} skill
   */
  remove(skill: Skill): void;

  /**
   * Find executable skills
   * @param {string}  search
   * @param {boolean} includePassive
   * @return {Skill}
   */
  find(search: string, includePassive?: boolean): Skill | undefined;
}
