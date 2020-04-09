import { EffectableEntity } from './EffectableEntity';
import { Metadatable } from './Metadatable';
import { Scriptable } from './Scriptable';

export declare class GameEntity extends Scriptable(Metadatable(EffectableEntity)) {

}