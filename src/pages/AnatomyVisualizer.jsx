import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GlassPanel from '../components/ui/GlassPanel';
import useAppStore from '../store/useAppStore';

// Add Preload Logic for your paths
// IMPORTANT: Drop your actual exported GLTF/GLB files into the public/models directory of this project.
useGLTF.preload('/models/female_body.glb');
useGLTF.preload('/models/male_body.glb');

// Error Boundary for seamless fallback if model doesn't exist
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
        <Html center>
          <div className="bg-surface-container-high/90 border border-error p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-2">
             <span className="material-symbols-outlined text-error text-3xl">error</span>
             <h3 className="font-headline font-bold text-on-surface">3D Model failed to load</h3>
             <p className="text-sm text-on-surface-variant">Please ensure /models/{this.props.gender}_body.glb exists in your public directory.</p>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// --- GLTF External Model Loader ---
const GLTFHumanBody = ({ gender, layers, setSelectedOrgan }) => {
  // We use a publicly hosted human model fallback (Soldier.glb from Three.js repo) 
  // since the local /models/male_body.glb doesn't exist yet!
  const publicFallbackUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Soldier.glb';
  const modelUrl = publicFallbackUrl; // Forcing fallback so the screen doesn't error out
  
  const { scene } = useGLTF(modelUrl);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material = child.material.clone();
        }

        const name = child.name.toLowerCase();

        // Standard Medical Naming 
        if (name.includes('heart') || name.includes('myocardium')) {
          child.userData = { category: 'organs', name: 'Heart', fact: 'Pumps blood.', flow: '5 L/m' };
        } else if (name.includes('lung')) {
          child.userData = { category: 'organs', name: 'Lung', fact: 'Provides gas exchange.', flow: 'Pulmonary' };
        } else if (name.includes('liver')) {
          child.userData = { category: 'organs', name: 'Liver', fact: 'Metabolizes drugs.', flow: '1.5 L/m' };
        } else if (name.includes('stomach')) {
          child.userData = { category: 'organs', name: 'Stomach', fact: 'Muscular organ.', flow: '200 ml/min' };
        } else if (name.includes('kidney')) {
          child.userData = { category: 'organs', name: 'Kidney', fact: 'Filters blood.', flow: '1.2 L/m' };
        } else if (name.includes('intestine')) {
          child.userData = { category: 'organs', name: 'Intestines', fact: 'Absorption site.', flow: '800 ml/min' };
        } else if (name.includes('brain')) {
          child.userData = { category: 'nervous', name: 'Brain', fact: 'Command center.', flow: '750 ml/m' };
        } 
        
        // +++ FALLBACK MAPPING FOR PUBLIC MODEL +++
        // Since we are loading the Soldier.glb, we map its generic meshes to body systems to test the logic
        else if (name.includes('vanguard_mesh')) {
          child.userData = { category: 'muscular', name: 'Human Interface (Vanguard Body)', fact: 'Demo full-body mesh interaction.', flow: 'Variable' };
        } else if (name.includes('visor')) {
          child.userData = { category: 'nervous', name: 'Ocular Visor', fact: 'Simulates optical diagnostic interaction.', flow: 'Neural' };
        }
        else {
          child.userData = { category: 'skeletal' }; 
        }
      }
    });
  }, [clonedScene]);

  useFrame(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
         const category = child.userData.category;
         if (category) {
             child.visible = !!layers[category]; 
             // Note: if you disable muscular layer, the Vanguard body vanishes!
         }
      }
    });
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    
    if (mesh.userData && mesh.userData.name) {
      document.body.style.cursor = 'pointer';
      if (mesh.material) {
          if (!mesh.userData.originalEmissive) {
              mesh.userData.originalEmissive = mesh.material.emissive ? mesh.material.emissive.clone() : new THREE.Color(0x000000);
              mesh.userData.originalEmissiveIntensity = mesh.material.emissiveIntensity || 0;
          }
          mesh.material.emissive = new THREE.Color('#00DBDE');
          mesh.material.emissiveIntensity = 1.0;
      }
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.userData && mesh.userData.name) {
      document.body.style.cursor = 'auto';
      if (mesh.material && mesh.userData.originalEmissive) {
         mesh.material.emissive.copy(mesh.userData.originalEmissive);
         mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity;
      }
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.userData && mesh.userData.name) {
       setSelectedOrgan({
         name: mesh.userData.name,
         fact: mesh.userData.fact,
         flow: mesh.userData.flow
       });
    }
  };

  return (
    <primitive 
      object={clonedScene} 
      position={[0, -1.5, 0]} 
      scale={1.5}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};

const AnatomyVisualizer = () => {
  const { selectedGender, setSelectedGender, anatomyLayer, toggleAnatomyLayer, selectedOrgan, setSelectedOrgan } = useAppStore();

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 pointer-events-auto bg-background">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color={selectedGender === 'male' ? "#43f3f6" : "#ff50fc"} />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#bf81ff" />
          
          <Suspense fallback={<Html center><div className="text-primary font-headline animate-pulse whitespace-nowrap">Downloading External 3D Model...</div></Html>}>
              <ModelErrorBoundary gender={selectedGender}>
                  <GLTFHumanBody gender={selectedGender} layers={anatomyLayer} setSelectedOrgan={setSelectedOrgan} />
              </ModelErrorBoundary>
              <ContactShadows position={[0, -3.8, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
              <Environment preset="city" />
          </Suspense>

          {/* Camera Smooth Damping Setup */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
            autoRotate={!selectedOrgan} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* Floating Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto z-30">
        <GlassPanel className="p-1 rounded-full flex items-center gap-1 shadow-2xl">
            <button 
                onClick={() => setSelectedOrgan(null) || setSelectedGender('female')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedGender === 'female' ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(67,243,246,0.3)]' : 'text-on-surface-variant hover:text-white'}`}
            >
                Female Model
            </button>
            <button 
                onClick={() => setSelectedOrgan(null) || setSelectedGender('male')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedGender === 'male' ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(67,243,246,0.3)]' : 'text-on-surface-variant hover:text-white'}`}
            >
                Male Model
            </button>
        </GlassPanel>
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
               Hover over organs to scan logic
            </p>
        </div>
      )}
    </div>
  );
};

export default AnatomyVisualizer;

