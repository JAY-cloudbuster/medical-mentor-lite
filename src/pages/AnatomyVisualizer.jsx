import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GlassPanel from '../components/ui/GlassPanel';
import useAppStore from '../store/useAppStore';

// === BLUEPRINT: ASSET PIPELINE & RUNTIME ARCHITECTURE ===
// 1. You must place your optimally exported, Draco-compressed GLB files in the `/public/models/` folder.
// 2. We use separate models for each semantic layer:
//    - skeleton.glb
//    - organs.glb
//    - nervous.glb
//    - muscles.glb

// uncomment to preload once you have the assets:
// useGLTF.preload('/models/skeleton.glb');
// useGLTF.preload('/models/organs.glb');
// useGLTF.preload('/models/nervous.glb');
// useGLTF.preload('/models/muscles.glb');

// A smart fallback that renders basic geometry so the developer can TEST interaction logic right now!
const FallbackMesh = ({ layerName, isVisible, setSelectedOrgan }) => {
  if (!isVisible) return null;

  // Render different primitive shapes based on the layer
  const config = {
    skeletal: { color: '#ffffff', position: [0, 0, 0], scale: [1, 3, 1], name: 'Demo Skeleton', fact: 'Skeletal framework base structure.' },
    muscular: { color: '#ff50fc', position: [-1.5, 0, 0], scale: [0.8, 2.5, 0.8], name: 'Demo Bicep', fact: 'Muscular system demonstrator.' },
    nervous:  { color: '#bf81ff', position: [1.5, 0, 0], scale: [0.5, 3.5, 0.5], name: 'Demo Spine Nerve', fact: 'Nervous system pathway.' },
    organs:   { color: '#ff716c', position: [0, 1, 1], scale: [0.8, 0.8, 0.8], name: 'Demo Heart', fact: 'Central cardiovascular pump demonstrator.' }
  };

  const current = config[layerName] || config.organs;

  return (
    <mesh 
       position={current.position} 
       scale={current.scale}
       onPointerOver={(e) => {
         e.stopPropagation();
         if (layerName === 'organs' || layerName === 'muscular') {
             document.body.style.cursor = 'pointer';
             if (!e.object.userData.originalEmissive) {
                 e.object.userData.originalEmissive = e.object.material.emissive.clone();
             }
             e.object.material.emissive.set('#00DBDE');
             e.object.material.emissiveIntensity = 0.5;
         }
       }}
       onPointerOut={(e) => {
         e.stopPropagation();
         if (layerName === 'organs' || layerName === 'muscular') {
             document.body.style.cursor = 'auto';
             if (e.object.userData.originalEmissive) {
                 e.object.material.emissive.copy(e.object.userData.originalEmissive);
                 e.object.material.emissiveIntensity = 0;
             }
         }
       }}
       onClick={(e) => {
         e.stopPropagation();
         if (layerName === 'organs' || layerName === 'muscular') {
             setSelectedOrgan({
                name: current.name,
                fact: current.fact,
                flow: 'Demo Flow'
             });
         }
       }}
    >
      {layerName === 'organs' ? <sphereGeometry args={[1, 32, 32]} /> : <cylinderGeometry args={[0.5, 0.5, 2, 32]} />}
      <meshStandardMaterial color={current.color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
};

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <FallbackMesh 
           layerName={this.props.layerName} 
           isVisible={this.props.isVisible} 
           setSelectedOrgan={this.props.setSelectedOrgan} 
        />
      );
    }
    return this.props.children;
  }
}

// 🔥 SCENE COMPOSITION: Real Mesh Targetting & Traversal
const AnatomicalLayer = ({ modelPath, layerName, isVisible, setSelectedOrgan }) => {
  // Try loading the specific layer model
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // 🔥 MESH INTERACTION SYSTEM: Traverse ONCE (not every render)
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Clone material so we can highlight without affecting other instances
        if (child.material) {
          child.material = child.material.clone();
        }
        
        // Use real semantic names from the GLB (e.g., 'left_lung', 'heart')
        child.userData = {
          name: child.name.replace(/_/g, ' ').toUpperCase(),
          category: layerName
        };
      }
    });
  }, [clonedScene, layerName]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && (layerName === 'organs' || layerName === 'muscular')) {
      document.body.style.cursor = 'pointer';
      if (mesh.material) {
        if (!mesh.userData.originalEmissive) {
          mesh.userData.originalEmissive = mesh.material.emissive ? mesh.material.emissive.clone() : new THREE.Color(0x000000);
        }
        mesh.material.emissive = new THREE.Color('#00DBDE');
        mesh.material.emissiveIntensity = 0.5;
      }
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && (layerName === 'organs' || layerName === 'muscular')) {
      document.body.style.cursor = 'auto';
      if (mesh.material && mesh.userData.originalEmissive) {
        mesh.material.emissive.copy(mesh.userData.originalEmissive);
        mesh.material.emissiveIntensity = 0;
      }
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && (layerName === 'organs' || layerName === 'muscular')) {
      setSelectedOrgan({
        name: mesh.userData.name,
        // In a real database, connect `mesh.name` to your medical terminology store
        fact: `Pathological analysis active for ${mesh.userData.name}. Mesh decoupled from parent hierarchy.`,
        flow: 'Auto-mapped'
      });
    }
  };

  return (
    <primitive 
      object={clonedScene} 
      position={[0, -3, 0]} 
      scale={3} // Adjust scale depending on your Blender export
      visible={isVisible}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};

const AnatomyVisualizer = () => {
  const { anatomyLayer, toggleAnatomyLayer, selectedOrgan, setSelectedOrgan } = useAppStore();

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 pointer-events-auto bg-background">
        {/* 🔥 RAYCAST OPTIMIZATION: Large models = heavy raycasting. Add threshold. */}
        <Canvas 
            camera={{ position: [0, 0, 8], fov: 45 }}
            raycaster={{ params: { Mesh: { threshold: 0.2 } } }} 
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]}  intensity={1.5} color={"#43f3f6"} />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#bf81ff" />
          
          <Suspense fallback={<Html center><div className="text-primary font-headline animate-pulse whitespace-nowrap">Loading Medical Assets...</div></Html>}>
             {/* 🔥 HUMAN MODEL SYSTEM: Load multiple separate models based on State Control */}
              <ModelErrorBoundary modelPath="/models/skeleton.glb" layerName="skeletal" isVisible={anatomyLayer.skeletal} setSelectedOrgan={setSelectedOrgan}>
                  <AnatomicalLayer modelPath="/models/skeleton.glb" layerName="skeletal" isVisible={anatomyLayer.skeletal} setSelectedOrgan={setSelectedOrgan} />
              </ModelErrorBoundary>
              
              <ModelErrorBoundary modelPath="/models/muscles.glb" layerName="muscular" isVisible={anatomyLayer.muscular} setSelectedOrgan={setSelectedOrgan}>
                  <AnatomicalLayer modelPath="/models/muscles.glb" layerName="muscular" isVisible={anatomyLayer.muscular} setSelectedOrgan={setSelectedOrgan} />
              </ModelErrorBoundary>
              
              <ModelErrorBoundary modelPath="/models/nervous.glb" layerName="nervous" isVisible={anatomyLayer.nervous} setSelectedOrgan={setSelectedOrgan}>
                  <AnatomicalLayer modelPath="/models/nervous.glb" layerName="nervous" isVisible={anatomyLayer.nervous} setSelectedOrgan={setSelectedOrgan} />
              </ModelErrorBoundary>
              
              <ModelErrorBoundary modelPath="/models/organs.glb" layerName="organs" isVisible={anatomyLayer.organs} setSelectedOrgan={setSelectedOrgan}>
                  <AnatomicalLayer modelPath="/models/organs.glb" layerName="organs" isVisible={anatomyLayer.organs} setSelectedOrgan={setSelectedOrgan} />
              </ModelErrorBoundary>

              <ContactShadows position={[0, -3.8, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
              <Environment preset="city" />
          </Suspense>

          {/* 🔥 CAMERA SYSTEM OPTIMIZED */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.1}
            minDistance={2}
            maxDistance={8}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
            autoRotate={!selectedOrgan} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* Left Side Panel: Layer Toggles */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-72 glass-panel ghost-border rounded-2xl p-6 shadow-2xl flex flex-col gap-6 z-30 pointer-events-auto hidden md:flex">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface mb-1">Anatomy Layers</h2>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">GLTF Submeshes Active</p>
        </div>
        
        <div className="space-y-4">
          <div onClick={() => toggleAnatomyLayer('skeletal')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${anatomyLayer.skeletal ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">skull</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.skeletal ? 'text-white' : 'text-slate-400'}`}>Skeletal View</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.skeletal ? 'bg-primary shadow-[0_0_8px_rgba(67,243,246,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.skeletal ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>
          
          <div onClick={() => toggleAnatomyLayer('muscular')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
            <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-lg ${anatomyLayer.muscular ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">fitness_center</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.muscular ? 'text-white' : 'text-slate-400'}`}>Muscular Map</span>
            </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.muscular ? 'bg-secondary shadow-[0_0_8px_rgba(255,80,252,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.muscular ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>
          
          <div onClick={() => toggleAnatomyLayer('nervous')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-lg ${anatomyLayer.nervous ? 'bg-tertiary/20 text-tertiary' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">electric_bolt</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.nervous ? 'text-white' : 'text-slate-400'}`}>Nervous System</span>
            </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.nervous ? 'bg-tertiary shadow-[0_0_8px_rgba(191,129,255,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.nervous ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>

          <div onClick={() => toggleAnatomyLayer('organs')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-lg ${anatomyLayer.organs ? 'bg-error/20 text-error' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.organs ? 'text-white' : 'text-slate-400'}`}>Vital Organs</span>
            </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.organs ? 'bg-error shadow-[0_0_8px_rgba(255,113,108,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.organs ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel: Detail Card */}
      {selectedOrgan && (
        <GlassPanel className="absolute right-8 top-1/2 -translate-y-1/2 w-80 ghost-border rounded-2xl p-6 shadow-2xl z-30 pointer-events-auto hidden xl:block relative overflow-hidden animate-in slide-in-from-right-8 duration-500 fade-in">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <button onClick={() => setSelectedOrgan(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-1">
                 <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="flex justify-between items-start mb-6 pt-2">
            <div>
                <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Mesh Scan</h4>
                <h1 className="font-headline text-3xl font-bold text-on-surface">{selectedOrgan.name}</h1>
            </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                {selectedOrgan.fact}
            </p>
            <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-tighter text-outline font-bold">Diagnostics</span>
                <div className="flex items-center gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                <span>Status: Optimal Functionality</span>
                </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-on-surface-variant">Functional Capacity</span>
                <span className="text-xs font-bold text-primary">98%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[98%]"></div>
                </div>
            </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
            <div className="glass-panel ghost-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-outline uppercase mb-1">Blood Flow</span>
                <span className="text-lg font-headline font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis w-full">{selectedOrgan.flow}</span>
            </div>
            <div className="glass-panel ghost-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-outline uppercase mb-1">Oxygen Use</span>
                <span className="text-lg font-headline font-bold text-on-surface">Auto</span>
            </div>
            </div>
            
            <button className="w-full py-4 bg-surface-variant/40 hover:bg-surface-variant/60 ghost-border rounded-xl text-on-surface font-bold text-sm flex items-center justify-center gap-3 transition-all group">
               <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">biotech</span>
               Analyze Pathology
            </button>
        </GlassPanel>
      )}

      {/* Dynamic Hover Prompt */}
      {!selectedOrgan && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 px-6 py-2 glass-panel ghost-border rounded-full shadow-lg z-30 pointer-events-none text-center">
            <p className="text-xs font-medium text-on-surface-variant flex items-center justify-center gap-2 mb-1">
               <span className="material-symbols-outlined text-sm animate-pulse text-primary">touch_app</span>
               Install models in /public/models to view and scan logic.
            </p>
        </div>
      )}
    </div>
  );
};

export default AnatomyVisualizer;
