import * as THREE from 'three';

export interface Actor {
  id: string;
  type: 'humanoid' | 'robot' | 'alien' | 'creature' | 'statue';
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
  animation: {
    type: 'idle' | 'walk' | 'spin' | 'wave';
    speed: number;
    time: number;
  };
  interactions: string[];
}
