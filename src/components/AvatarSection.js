import React, { useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import './AvatarSection.css';

const AvatarSection = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const avatarMeshRef = useRef(null);
  const animationFrameRef = useRef(null);

  const { currentEmotion } = useChatContext();

  useEffect(() => {
    initAvatar();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateEmotion(currentEmotion);
  }, [currentEmotion]);

  const initAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas || !window.THREE) return;

    const THREE = window.THREE;

    // Setup scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    rendererRef.current = new THREE.WebGLRenderer({ canvas, alpha: true });
    rendererRef.current.setSize(400, 400);
    rendererRef.current.setClearColor(0x000000, 0);

    createBasicAvatar();

    cameraRef.current.position.z = 5;
    animate();
  };

  const createBasicAvatar = () => {
    const THREE = window.THREE;
    if (!THREE) return;

    // Head
    const headGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0xffdbac,
      shininess: 30
    });
    avatarMeshRef.current = new THREE.Mesh(headGeometry, headMaterial);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.3, 1.2);
    avatarMeshRef.current.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.3, 1.2);
    avatarMeshRef.current.add(rightEye);

    // Mouth
    const mouthGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.4, 1.1);
    mouth.rotation.x = Math.PI / 2;
    avatarMeshRef.current.add(mouth);

    sceneRef.current.add(avatarMeshRef.current);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    sceneRef.current.add(directionalLight);
  };

  const animate = () => {
    animationFrameRef.current = requestAnimationFrame(animate);

    if (avatarMeshRef.current) {
      avatarMeshRef.current.rotation.y += 0.005;
      avatarMeshRef.current.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.02;
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const updateEmotion = (emotion) => {
    if (!avatarMeshRef.current || avatarMeshRef.current.children.length < 3) return;

    const mouth = avatarMeshRef.current.children[2];

    if (emotion === 'happy') {
      mouth.material.color.setHex(0xff6b6b);
      mouth.scale.set(1.2, 1, 1.2);
    } else if (emotion === 'sad') {
      mouth.material.color.setHex(0x4169e1);
      mouth.scale.set(0.8, 1, 0.8);
    } else {
      mouth.material.color.setHex(0x888888);
      mouth.scale.set(1, 1, 1);
    }
  };

  const emotionEmojis = {
    happy: <><i className="fas fa-smile" style={{ color: '#22c55e' }}></i> Happy</>,
    sad: <><i className="fas fa-frown" style={{ color: '#ef4444' }}></i> Sad</>,
    neutral: <><i className="fas fa-meh" style={{ color: '#6b7280' }}></i> Neutral</>
  };

  return (
    <div className="avatar-section">
      <canvas ref={canvasRef} id="avatar-canvas" />
      <div className="avatar-controls">
        Click the menu button to access avatar controls and settings
      </div>
      <div className="emotion-indicator">
        {emotionEmojis[currentEmotion] || emotionEmojis.neutral}
      </div>
    </div>
  );
};

export default AvatarSection;
