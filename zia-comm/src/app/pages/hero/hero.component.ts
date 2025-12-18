import { Component, AfterViewInit, ElementRef } from '@angular/core';
import gsap from 'gsap';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // GSAP animations for text and button
    gsap.from('.hero-content > *', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Optional Three.js 3D background
    this.initThreeJS();
  }

  initThreeJS() {
    const container = this.el.nativeElement.querySelector('#hero-3d');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Simple rotating spheres as example
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.6, roughness: 0.4 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

      scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
