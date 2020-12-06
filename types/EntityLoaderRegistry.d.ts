import EntityLoader from '../src/EntityLoader';

/**
 * Holds instances of configured EntityLoaders
 * @type {Map<string, EntityLoader>}
 */
export declare class EntityLoaderRegistry extends Map {
  load(
    sourceRegistry: EntityLoader,
    config: { name: string; settings: object }
  ): void;
}
