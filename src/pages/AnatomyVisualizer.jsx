import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import GlassPanel from '../components/ui/GlassPanel';
import useAppStore from '../store/useAppStore';

// STEP 5: Graceful Error Handling
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="text-error font-headline font-bold bg-error/10 p-4 rounded-xl border border-error/20 whitespace-nowrap shadow-lg">
            Medical models not loaded
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// STEP 6: Handling non-medical mesh names from generic GLTFs
const organMap = {
  // Mapping BrainStem.glb (Organs fallback)
  'mesh_0': 'Central Cortex',
  'mesh_1': 'Medulla Oblongata',
  'mesh_2': 'Optical Nerve',
  'mesh_3': 'Spinal Cord',
  'mesh_4': 'Cerebellum',
  'mesh_5': 'Primary Vascular System',
  // Mapping RobotExpressive.glb (Skeleton fallback)
  'Head_2': 'Cranium (Skull)',
  'HandR_1': 'Right Phalanges',
  'HandL_1': 'Left Phalanges',
  'FootR_1': 'Right Tarsals',
  'FootL_1': 'Left Tarsals',
  'Torso_2': 'Rib Cage Matrix',
  'ArmR_1': 'Right Radius / Ulna',
  'ArmL_1': 'Left Radius / Ulna',
  'LegR_1': 'Right Tibia',
  'LegL_1': 'Left Tibia'
};

const OrganSystem = ({ isVisible, setSelectedOrgan }) => {
  // STEP 5: Loading from /public/models/
  const { scene, animations } = useGLTF('/models/organs.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    console.log("--- LOADED ORGAN MESHES ---");
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        console.log("Organ Mesh Discovered:", child.name);
        if (child.material) {
          child.material = child.material.clone();
          child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        }
      }
    });
  }, [clonedScene]);

  // Future animation support
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Play the first available animation
      const firstAction = Object.values(actions)[0];
      if (firstAction) firstAction.play();
    }
  }, [actions]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && mesh.material) {
      document.body.style.cursor = 'pointer';
      mesh.material.emissive = new THREE.Color('#00DBDE');
      mesh.material.emissiveIntensity = 0.5;
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && mesh.material && mesh.userData.originalEmissive) {
      document.body.style.cursor = 'auto';
      mesh.material.emissive.copy(mesh.userData.originalEmissive);
      mesh.material.emissiveIntensity = 0;
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh) {
      // Resolve name via dictionary
      const displayName = organMap[mesh.name] || mesh.name.replace(/_/g, ' ').toUpperCase();
      console.log('Clicked Organ:', mesh.name, '-> Display:', displayName);
      
      setSelectedOrgan({
        name: displayName,
        fact: `Pathological analysis active for ${displayName}. Raw mesh source: ${mesh.name}.`,
        flow: 'Auto-mapped via System Dictionary'
      });
    }
  };

  return (
    <primitive 
      object={clonedScene} 
      position={[0, -2, 0]} 
      scale={2} 
      visible={isVisible}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};

const SkeletalSystem = ({ isVisible, setSelectedOrgan }) => {
  const { scene, animations } = useGLTF('/models/skeleton.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    console.log("--- LOADED SKELETON MESHES ---");
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        console.log("Skeletal Mesh Discovered:", child.name);
        if (child.material) {
          child.material = child.material.clone();
          child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        }
      }
    });
  }, [clonedScene]);

  // Future animation support
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const walkAction = actions['Walking'] || Object.values(actions)[0];
      if (walkAction) walkAction.play();
    }
  }, [actions]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && mesh.material) {
      document.body.style.cursor = 'pointer';
      mesh.material.emissive = new THREE.Color('#bf81ff'); // Purple glow for skeleton
      mesh.material.emissiveIntensity = 0.5;
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh && mesh.material && mesh.userData.originalEmissive) {
      document.body.style.cursor = 'auto';
      mesh.material.emissive.copy(mesh.userData.originalEmissive);
      mesh.material.emissiveIntensity = 0;
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (mesh.isMesh) {
      const displayName = organMap[mesh.name] || mesh.name.replace(/_/g, ' ').toUpperCase();
      console.log('Clicked Skeleton:', mesh.name, '-> Display:', displayName);
      
      setSelectedOrgan({
        name: displayName,
        fact: `Osteological scan complete for ${displayName}. Raw mesh source: ${mesh.name}.`,
        flow: 'Auto-mapped via System Dictionary'
      });
    }
  };

  return (
    <primitive 
      object={clonedScene} 
      position={[0, -2, 0]} 
      scale={0.5} 
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
      <div className="absolute inset-0 pointer-events-auto bg-background">
        <Canvas 
            camera={{ position: [0, 1, 8], fov: 45 }}
            raycaster={{ params: { Mesh: { threshold: 0.2 } } }} 
        >
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]}  intensity={1.5} color={"#43f3f6"} />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#bf81ff" />
          
          <Suspense fallback={<Html center><div className="text-primary font-headline animate-pulse whitespace-nowrap">Loading 3D Engine...</div></Html>}>
              <ModelErrorBoundary>
                  {/* Layer visibility handled by Store */}
                  <OrganSystem 
                    isVisible={anatomyLayer.organs} 
                    setSelectedOrgan={setSelectedOrgan} 
                  />
                  <SkeletalSystem 
                    isVisible={anatomyLayer.skeletal} 
                    setSelectedOrgan={setSelectedOrgan}
                  />
              </ModelErrorBoundary>

              <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
              <Environment preset="city" />
          </Suspense>

          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.1}
            minDistance={2}
            maxDistance={8}
            target={[0, 0, 0]}
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
            <div className="mb-6 pt-2">
                <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Mesh Scan</h4>
                <h1 className="font-headline text-3xl font-bold text-on-surface break-words">{selectedOrgan.name}</h1>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                {selectedOrgan.fact}
            </p>
            <button className="w-full py-4 bg-surface-variant/40 hover:bg-surface-variant/60 ghost-border rounded-xl text-on-surface font-bold text-sm flex items-center justify-center gap-3 transition-all group">
               <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">biotech</span>
               Analyze Pathology
            </button>
        </GlassPanel>
      )}
    </div>
  );
};

export default AnatomyVisualizer;
