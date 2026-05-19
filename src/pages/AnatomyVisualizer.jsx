import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import useAppStore from '../store/useAppStore';

class ModelErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <Html center><div className="text-rose-500 font-semibold bg-rose-50 p-4 rounded-xl border border-rose-200 whitespace-nowrap shadow-lg">Medical models not loaded</div></Html>;
    return this.props.children;
  }
}

const organMap = {
  'mesh_0': 'Central Cortex', 'mesh_1': 'Medulla Oblongata', 'mesh_2': 'Optical Nerve', 'mesh_3': 'Spinal Cord', 'mesh_4': 'Cerebellum', 'mesh_5': 'Primary Vascular System',
  'Head_2': 'Cranium (Skull)', 'HandR_1': 'Right Phalanges', 'HandL_1': 'Left Phalanges', 'FootR_1': 'Right Tarsals', 'FootL_1': 'Left Tarsals',
  'Torso_2': 'Rib Cage Matrix', 'ArmR_1': 'Right Radius / Ulna', 'ArmL_1': 'Left Radius / Ulna', 'LegR_1': 'Right Tibia', 'LegL_1': 'Left Tibia'
};

const OrganSystem = ({ isVisible, setSelectedOrgan }) => {
  const { scene, animations } = useGLTF('/models/organs.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);
  useEffect(() => { clonedScene.traverse((child) => { if (child.isMesh && child.material) { child.material = child.material.clone(); child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000); } }); }, [clonedScene]);
  useEffect(() => { if (actions && Object.keys(actions).length > 0) { const first = Object.values(actions)[0]; if (first) first.play(); } }, [actions]);
  const handlePointerOver = (e) => { e.stopPropagation(); const m = e.object; if (m.isMesh && m.material) { document.body.style.cursor = 'pointer'; m.material.emissive = new THREE.Color('#6366f1'); m.material.emissiveIntensity = 0.5; } };
  const handlePointerOut = (e) => { e.stopPropagation(); const m = e.object; if (m.isMesh && m.material && m.userData.originalEmissive) { document.body.style.cursor = 'auto'; m.material.emissive.copy(m.userData.originalEmissive); m.material.emissiveIntensity = 0; } };
  const handleClick = (e) => { e.stopPropagation(); const m = e.object; if (m.isMesh) { const name = organMap[m.name] || m.name.replace(/_/g, ' ').toUpperCase(); setSelectedOrgan({ name, fact: `Pathological analysis active for ${name}.`, flow: 'Auto-mapped via System Dictionary' }); } };
  return <primitive object={clonedScene} position={[0, -2, 0]} scale={2} visible={isVisible} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick} />;
};

const SkeletalSystem = ({ isVisible, setSelectedOrgan }) => {
  const { scene, animations } = useGLTF('/models/skeleton.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);
  useEffect(() => { clonedScene.traverse((child) => { if (child.isMesh && child.material) { child.material = child.material.clone(); child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000); } }); }, [clonedScene]);
  useEffect(() => { if (actions && Object.keys(actions).length > 0) { const walk = actions['Walking'] || Object.values(actions)[0]; if (walk) walk.play(); } }, [actions]);
  const handlePointerOver = (e) => { e.stopPropagation(); const m = e.object; if (m.isMesh && m.material) { document.body.style.cursor = 'pointer'; m.material.emissive = new THREE.Color('#8b5cf6'); m.material.emissiveIntensity = 0.5; } };
  const handlePointerOut = (e) => { e.stopPropagation(); const m = e.object; if (m.isMesh && m.material && m.userData.originalEmissive) { document.body.style.cursor = 'auto'; m.material.emissive.copy(m.userData.originalEmissive); m.material.emissiveIntensity = 0; } };
  const handleClick = (e) => { e.stopPropagation(); const m = e.object; if (m.isMesh) { const name = organMap[m.name] || m.name.replace(/_/g, ' ').toUpperCase(); setSelectedOrgan({ name, fact: `Osteological scan complete for ${name}.`, flow: 'Auto-mapped via System Dictionary' }); } };
  return <primitive object={clonedScene} position={[0, -2, 0]} scale={0.5} visible={isVisible} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick} />;
};

const AnatomyVisualizer = () => {
  const { anatomyLayer, toggleAnatomyLayer, selectedOrgan, setSelectedOrgan } = useAppStore();

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-auto dark-canvas-bg">
        <Canvas camera={{ position: [0, 1, 8], fov: 45 }} raycaster={{ params: { Mesh: { threshold: 0.2 } } }}>
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color={"#6366f1"} />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#8b5cf6" />
          <Suspense fallback={<Html center><div className="text-indigo-500 font-medium animate-pulse whitespace-nowrap font-inter">Loading 3D Engine...</div></Html>}>
            <ModelErrorBoundary>
              <OrganSystem isVisible={anatomyLayer.organs} setSelectedOrgan={setSelectedOrgan} />
              <SkeletalSystem isVisible={anatomyLayer.skeletal} setSelectedOrgan={setSelectedOrgan} />
            </ModelErrorBoundary>
            <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom enablePan={false} enableDamping dampingFactor={0.1} minDistance={2} maxDistance={8} target={[0, 0, 0]} autoRotate={!selectedOrgan} autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Light overlay: Layer Toggles */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-xl flex flex-col gap-5 z-30 pointer-events-auto hidden md:flex font-inter">
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-0.5">Anatomy Layers</h2>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">GLTF Submeshes Active</p>
        </div>
        <div className="space-y-3">
          <div onClick={() => toggleAnatomyLayer('skeletal')} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${anatomyLayer.skeletal ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">skull</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.skeletal ? 'text-gray-900' : 'text-gray-400'}`}>Skeletal View</span>
            </div>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${anatomyLayer.skeletal ? 'bg-indigo-500' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${anatomyLayer.skeletal ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>
          <div onClick={() => toggleAnatomyLayer('organs')} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${anatomyLayer.organs ? 'bg-rose-100 text-rose-500' : 'bg-gray-100 text-gray-400'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.organs ? 'text-gray-900' : 'text-gray-400'}`}>Vital Organs</span>
            </div>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${anatomyLayer.organs ? 'bg-rose-500' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${anatomyLayer.organs ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Light overlay: Detail Card */}
      {selectedOrgan && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-72 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-xl z-30 pointer-events-auto hidden xl:block font-inter">
          <button onClick={() => setSelectedOrgan(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-1">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div className="mb-4 pt-1">
            <h4 className="text-[10px] font-semibold text-indigo-600 tracking-widest uppercase mb-1">Mesh Scan</h4>
            <h1 className="text-2xl font-display text-gray-900 break-words">{selectedOrgan.name}</h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">{selectedOrgan.fact}</p>
          <button className="w-full py-3 bg-gray-900 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-base">biotech</span> Analyze Pathology
          </button>
        </div>
      )}
    </div>
  );
};

export default AnatomyVisualizer;
