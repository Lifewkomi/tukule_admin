
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "reserved" | "occupied";
  x: number;
  y: number;
  width: number;
  length: number;
}

interface TableVisualizationProps {
  tables: Table[];
  onTableClick: (tableId: string) => void;
}

const TableVisualization: React.FC<TableVisualizationProps> = ({
  tables,
  onTableClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const tableObjectsRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const [view, setView] = useState<"3d" | "2d">("3d");
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Lights setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Floor setup
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    
    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(20, 3, 0.2);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 1.5, -10);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(0.2, 3, 20);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-10, 1.5, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    
    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(0.2, 3, 20);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(10, 1.5, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Plant decoration
    const potGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 16);
    const potMaterial = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.set(8, 0.3, -8);
    pot.castShadow = true;
    pot.receiveShadow = true;
    scene.add(pot);

    const plantGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const plant = new THREE.Mesh(plantGeometry, plantMaterial);
    plant.position.set(8, 1.2, -8);
    plant.castShadow = true;
    scene.add(plant);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Event handlers for raycasting
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !rendererRef.current) return;
      
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Perform raycasting
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const tableObjects = Object.values(tableObjectsRef.current);
        const intersects = raycasterRef.current.intersectObjects(tableObjects);

        if (intersects.length > 0) {
          const tableId = intersects[0].object.userData.tableId;
          const table = tables.find(t => t.id === tableId) || null;
          setHoveredTable(table);
          containerRef.current.style.cursor = "pointer";
        } else {
          setHoveredTable(null);
          containerRef.current.style.cursor = "default";
        }
      }
    };

    const handleClick = () => {
      if (hoveredTable) {
        setSelectedTable(hoveredTable);
        onTableClick(hoveredTable.id);
      } else {
        setSelectedTable(null);
      }
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("click", handleClick);
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [onTableClick]);

  // Update tables in the scene
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing tables
    Object.values(tableObjectsRef.current).forEach(table => {
      sceneRef.current?.remove(table);
    });
    tableObjectsRef.current = {};

    // Add tables
    tables.forEach(table => {
      const tableWidth = table.width || 1.2;
      const tableLength = table.length || 1.8;
      
      // Table top
      const tableGeometry = new THREE.BoxGeometry(tableWidth, 0.1, tableLength);
      const tableMaterial = new THREE.MeshStandardMaterial({
        color: getTableColor(table.status),
      });
      const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
      tableMesh.position.set(table.x, 0.75, table.y);
      tableMesh.castShadow = true;
      tableMesh.receiveShadow = true;
      tableMesh.userData = { tableId: table.id };
      sceneRef.current.add(tableMesh);
      
      // Table legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x757575 });
      
      const leg1 = new THREE.Mesh(legGeometry, legMaterial);
      leg1.position.set(
        table.x - tableWidth / 2 + 0.1,
        0.35,
        table.y - tableLength / 2 + 0.1
      );
      leg1.castShadow = true;
      sceneRef.current.add(leg1);
      
      const leg2 = new THREE.Mesh(legGeometry, legMaterial);
      leg2.position.set(
        table.x + tableWidth / 2 - 0.1,
        0.35,
        table.y - tableLength / 2 + 0.1
      );
      leg2.castShadow = true;
      sceneRef.current.add(leg2);
      
      const leg3 = new THREE.Mesh(legGeometry, legMaterial);
      leg3.position.set(
        table.x - tableWidth / 2 + 0.1,
        0.35,
        table.y + tableLength / 2 - 0.1
      );
      leg3.castShadow = true;
      sceneRef.current.add(leg3);
      
      const leg4 = new THREE.Mesh(legGeometry, legMaterial);
      leg4.position.set(
        table.x + tableWidth / 2 - 0.1,
        0.35,
        table.y + tableLength / 2 - 0.1
      );
      leg4.castShadow = true;
      sceneRef.current.add(leg4);
      
      // Chairs
      const chairSeatGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.4);
      const chairLegGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
      const chairBackGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.05);
      const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x9e9e9e });
      
      // Add chairs around the table
      const chairPositions = [
        { x: 0, z: -tableLength / 2 - 0.3, rotY: 0 },
        { x: 0, z: tableLength / 2 + 0.3, rotY: Math.PI },
        { x: -tableWidth / 2 - 0.3, z: 0, rotY: -Math.PI / 2 },
        { x: tableWidth / 2 + 0.3, z: 0, rotY: Math.PI / 2 },
      ];
      
      chairPositions.forEach(pos => {
        const chairGroup = new THREE.Group();
        
        const seat = new THREE.Mesh(chairSeatGeometry, chairMaterial);
        seat.position.y = 0.4;
        chairGroup.add(seat);
        
        const back = new THREE.Mesh(chairBackGeometry, chairMaterial);
        back.position.set(0, 0.6, -0.2);
        chairGroup.add(back);
        
        // Chair legs
        for (let i = 0; i < 4; i++) {
          const legX = (i % 2 === 0 ? -1 : 1) * 0.15;
          const legZ = (i < 2 ? -1 : 1) * 0.15;
          const leg = new THREE.Mesh(chairLegGeometry, chairMaterial);
          leg.position.set(legX, 0.2, legZ);
          chairGroup.add(leg);
        }
        
        chairGroup.position.set(
          table.x + pos.x,
          0,
          table.y + pos.z
        );
        chairGroup.rotation.y = pos.rotY;
        chairGroup.castShadow = true;
        sceneRef.current?.add(chairGroup);
      });
      
      // Store reference to table mesh
      tableObjectsRef.current[table.id] = tableMesh;
    });
  }, [tables, view]);

  // Change view between 3D and 2D
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    if (view === "2d") {
      cameraRef.current.position.set(0, 15, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.enabled = false;
    } else {
      cameraRef.current.position.set(0, 10, 10);
      controlsRef.current.enabled = true;
      controlsRef.current.update();
    }
  }, [view]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (
        !containerRef.current ||
        !rendererRef.current ||
        !cameraRef.current
      )
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to get table color based on status
  const getTableColor = (status: string) => {
    switch (status) {
      case "available":
        return 0x4caf50; // Green
      case "reserved":
        return 0xffc107; // Amber
      case "occupied":
        return 0xf44336; // Red
      default:
        return 0x9e9e9e; // Grey
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "reserved":
        return "Reserved";
      case "occupied":
        return "Occupied";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Restaurant Layout</CardTitle>
            <CardDescription>
              3D visualization of tables and their status
            </CardDescription>
          </div>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "3d" | "2d")}
            className="w-[160px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="3d">3D View</TabsTrigger>
              <TabsTrigger value="2d">2D View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div
          ref={containerRef}
          className="w-full h-[500px] relative overflow-hidden rounded-b-lg"
        />
        
        {hoveredTable && (
          <div className="absolute bottom-4 left-4 max-w-xs bg-white/90 backdrop-blur-sm p-2 rounded-md border border-border shadow-lg">
            <p className="font-medium">{hoveredTable.name}</p>
            <p className="text-sm text-muted-foreground">
              Capacity: {hoveredTable.capacity} people
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {getStatusText(hoveredTable.status)}
            </p>
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          {["available", "reserved", "occupied"].map((status) => (
            <div key={status} className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md border border-border shadow-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: `#${getTableColor(status).toString(16)}` }}
              />
              <span className="text-xs">{getStatusText(status)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableVisualization;
