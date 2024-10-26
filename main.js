import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);




var map = document.getElementById('map');
var textContent = document.getElementById('text-content');
const canvas = document.querySelector('canvas')
var act = document.getElementById('act');
var sences_container = document.getElementById('sences_container');
var alien = document.getElementById('alien');

map.style.display = 'none';




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// Load HDRI
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/autumn_field_puresky_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
     scene.environment = texture;
});

// Load textures
const textureLoader = new TextureLoader();
const baseColorTexture = textureLoader.load('nepirus/textures/Nepirus_baseColor.png');
const metalnessTexture = textureLoader.load('nepirus/textures/Nepirus_metallicRoughness.png');
const normalTexture = textureLoader.load('nepirus/textures/Nepirus_normal.png');

// Create a sphere mesh with textures
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ 
    map: baseColorTexture,
    metalnessMap: metalnessTexture,
    normalMap: normalTexture,
    metalness: 0.5,
    roughness: 0.5
});
const sphere = new THREE.Mesh(geometry, material);
sphere.rotation.x = 2;
scene.add(sphere);

// camera.position.x = 2;
// Create a second, smaller sphere
const geometry2 = new THREE.SphereGeometry(0.2, 32, 32);
const material2 = new THREE.MeshStandardMaterial({
    color: "grey",
    metalness: 0.3,
    roughness: 0.7
});
const sphere2 = new THREE.Mesh(geometry2, material2);
scene.add(sphere2);

// Create a pivot point for the small sphere
const pivot = new THREE.Object3D();
sphere.add(pivot);
pivot.add(sphere2);

// Position the small sphere
sphere2.position.set(1.5, 0, 0);

// Load GLTF model
const loader = new GLTFLoader();
// loader.load(
//     '/nepirus/scene.gltf',
//     function (gltf) {
//         const model = gltf.scene;
//         model.scale.set(0.1, 0.1, 0.1); // Scale down the model
//         model.position.set(0, -1, 0); // Position the model
//         scene.add(model);
//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     function (error) {
//         console.error('An error happened', error);
//     }
// );

// Load GLTF model with textures


// Set up camera position
camera.position.z = 2;


// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect
controls.minDistance = 1.5; // Set minimum zoom distance
controls.maxDistance = 10; // Set maximum zoom distance

// Set up EffectComposer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add RGB Shift effect
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0015;
composer.addPass(rgbShiftPass);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls in the animation loop
    
    // Add rotation to the main sphere (slower)
    sphere.rotation.y += 0.0002;
    
    // Rotate the pivot to make the small sphere orbit (slower)
    pivot.rotation.y += 0.003;
    
    // Add rotation to the GLTF model (if it's loaded) (slower)
    const model = scene.getObjectByName('Scene');
    if (model) {
        model.rotation.y += 0.0008;
    }
    
    composer.render(); // Use composer instead of renderer
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Resize composer as well
});

// Initialize renderer and composer size
renderer.setSize(window.innerWidth, window.innerHeight);
composer.setSize(window.innerWidth, window.innerHeight);

composer.render(); // Initial render using composer

// Camera zoom in and out
function zoomCamera(zoomIn) {
    const zoomSpeed = 0.1;
    const targetZoom = zoomIn ? camera.position.z - zoomSpeed : camera.position.z + zoomSpeed;
    
    gsap.to(camera.position, {
        z: targetZoom,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function() {
            camera.updateProjectionMatrix();
        },
        onComplete: function() {
            controls.update();
        }
    });
}

// Add event listeners for zoom
window.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') {
        zoomCamera(true);
    } else if (e.key === '-' || e.key === '_') {
        zoomCamera(false);
    }
});

// You can also add mouse wheel zoom if desired
// canvas.addEventListener('wheel', (e) => {
//     zoomCamera(e.deltaY < 0);
// });




var dailogs = [
   
 " In Year 2324, There is a spaceship roaming around the space!",
 "wandering, roaming they find out a planet which is devastated ",
 " Alien 1:What is that... a planet in such a sorry state?",
  'Alien 2 :Strange... let me access our database.',
  'Alien 2 brings up a holographic display showing a database search.',
  "Alien 2 look at the database and finds out it is Earth; Place where life once flourished",
  'Alien 1:Earth?.. But it doesnt look like the paradise described here.',
  'Alien 2:Something must have gone terribly wrong. We have to investigate, shall we explore?....',
  "Now you can investigate , by using menu button on the right, you acces the data",
  'And find out  how climate change affected the earth...'
]




var count = 0;
textContent.textContent = dailogs[count];
window.addEventListener('keydown',(e)=>{
    if(e.key == 'Enter' || e.key == 'ArrowRight'){
        console.log(count)
        if(count < dailogs.length-1){
           count++;
           textContent.textContent = dailogs[count];
        }

        if(count == 2)
        {
            alien.style.display = 'block';
           alien.innerHTML='<img src="photos/alien.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
           sences_container.innerHTML='<img src="photos/alien-conva-pixel.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
        }
        if(count == 1){
            sences_container.innerHTML='<img src="photos/alien-in sapce.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
        }
        if(count == 3){
            alien.innerHTML='<img src="photos/alien-2.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
            sences_container.innerHTML='<img src="photos/halogram.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
        }
        if (count==4){
            page1.style.backgroundColor = 'black';
            alien.style.display = 'none';
           canvas.style.display = 'block';
           sences_container.style.opacity = 0;
           gsap.from(camera.position, {
            z: 12,
            x:5,
            duration: 1,          
            ease: "expo",
           
           })
        }
        if(count == 6){
            alien.innerHTML='<img src="photos/alien.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
            alien.style.display = 'block';
        }
        if(count == 7){
            alien.innerHTML='<img src="photos/alien-2.png" alt="" style="width:100%;height:100%;object-fit: cover;">';

        }
        if(count == 8){
         
            page1.style.backgroundColor = 'black';
            text.style.display = 'none';
            heading.style.display = 'none';
            act.style.display = 'block';
            sences_container.style.display = 'none';

           
            document.getElementById('ACT').style.display = 'block';
            act.innerHTML =  `<h1 id="aCT" style="text-align: center; margin-top: 30px;"> ACT II </h1>
            <h1 id="aCT" style="text-align: center; margin-top: 30px;"> INVESTIGATION </h1>`;
            heading.innerHTML = '<h1 style="font-size: 40px;font-weight: bold; opacity: 0.7;">2. INVESTIGATION</h1>';
            var tl2 = gsap.timeline();
            tl2.fromTo("#act", {
                width: 0
            }, {
                width: 1000,
                duration: 1,
                delay: 0
            });
            tl2.from("#aCT", {
                opacity: 0,
                duration: 1,
                delay:1,
            });
            tl2.to("#act", {
                width: 0,
                duration: 1,
                delay:1,
            },"thrid");
            tl2.to("#aCT", {
                opacity: 0,
                duration: 1,
                delay:0.5,
            },"thrid");
            tl2.to("#act", {
                display: 'none',
            }, 'fist');
            tl2.to("#text", {
                display: 'block',
            }, 'fist');
        
            tl2.to("#heading",   
                {
                   display: 'block',
                   width: 500,
                }, "second");
            tl2.to("#heading-content",    
                {
                    opacity: 0.5,
                    duration:0.7,
                    delay: 0.5,
                }, "second");
            tl2.from("#text", {
                opacity: 0,
                duration: 1,
            },"second");
    
            

   
       
            // canvas.style.display = 'none';
        }

        


    }if(e.key == 'ArrowLeft'){

        console.log(count)
        if(count > 0){
            count--;
            textContent.textContent = dailogs[count];
        }
        if(count == 0)
            {
            
               sences_container.innerHTML='<img src="photos/spaceship-pixel.png" alt="" style="width:100%;height:100%;object-fit: cover;">';
            }
            if(count == 1)
            {
                
                   sences_container.innerHTML='<img src="photos/alien-in sapce.png"" alt="" style="width:100%;height:100%;object-fit: cover;">';
            }
            if(count == 3){
                canvas.style.display = 'none';
                sences_container.style.opacity = 1;
                
                // Add texture to the sphere
             
            }
 


    }
    
})


  
function mapAnimation(){    


map.style.transform = 'scale(0.7)';

let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

map.addEventListener("mousedown", function(e) {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    map.style.cursor = 'grabbing';
    map.style.transition = 'none'; // Remove transition on mousedown for immediate response
});

map.addEventListener("mousemove", function(e) {
    if (isDragging) {
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
       
        requestAnimationFrame(() => {
            map.style.transform = `translate(${currentX}px, ${currentY}px) scale(0.7)`;
        
        });
    }
});

map.addEventListener("mouseup", function() {
    isDragging = false;
    map.style.cursor = 'grab';
    map.style.transition = 'transform 0.2s ease-out'; // Add a slight transition on release for smoothness
});

map.addEventListener("mouseleave", function() {
    if (isDragging) {
        isDragging = false;
        map.style.cursor = 'grab';
        map.style.transition = 'transform 0.2s ease-out';
    }
});

// Prevent default drag behavior
map.addEventListener('dragstart', function(e) {
    e.preventDefault();
});
}
mapAnimation();

function actAnimation() {
    var tl = gsap.timeline();
    tl.fromTo("#act", {
        width: 0
    }, {
        width: 1000,
        duration: 1,
        delay: 0.5
    });
    tl.fromTo("#ACT", {
        opacity: 0
    }, {
        opacity: 1,
        duration: 1
    });
    tl.to("#ACT", {
        opacity: 0,
        duration: 1,
        delay: 1,
    });
    tl.to("#act", {
        width: 0,
        duration: 1
    });
    tl.to("#act", {
        display: 'none',
    }, 'fist');
    tl.to("#text", {
        display: 'block',
    }, 'fist');

    tl.to("#heading",   
        {
           display: 'block',
           width: 500,
        }, "second");
    tl.to("#heading-content",    
        {
            opacity: 0.5,
            duration:0.7,
            delay: 0.5,
        }, "second");
    tl.from("#text", {
        opacity: 0,
        duration: 1,
    },"second");
    tl.to("#sences_container", {
        opacity: 1,
        duration: 1,
    }, "second");
}


actAnimation();

var canvas_1 = document.getElementById('frame');
const ctx_1 = canvas_1.getContext('2d');

const frame = {
    currentIndex: 0,
    maxIndex: 60,
};

const images = [];

function preloadImages() {
    return new Promise((resolve, reject) => {
        let loadedImages = 0;
        for (let i = 0; i <= frame.maxIndex; i++) {
            const imageUrl = `/temp/frame_${i.toString().padStart(4, '0')}.jpeg`;
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                loadedImages++;
                if (loadedImages === frame.maxIndex + 1) {
                    resolve();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${imageUrl}`);
                loadedImages++;
                if (loadedImages === frame.maxIndex + 1) {
                    resolve();
                }
            };
            images.push(img);
        }
    });
}

function drawImage(index) {
    if (index < 0 || index > frame.maxIndex) {
        console.warn(`Index ${index} is out of bounds`);
        return;
    }

    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
        console.warn(`Image at index ${index} is not fully loaded or is broken`);
        return;
    }

    canvas_1.width = window.innerWidth;
    canvas_1.height = window.innerHeight;

    const scaleX = window.innerWidth / img.width;
    const scaleY = window.innerHeight / img.height;
    const scale = Math.min(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const offsetX = (canvas_1.width - newWidth) / 2;
    const offsetY = (canvas_1.height - newHeight) / 2;

    ctx_1.clearRect(0, 0, canvas_1.width, canvas_1.height);
    ctx_1.imageSmoothingEnabled = true;
    ctx_1.imageSmoothingQuality = 'high';
    ctx_1.drawImage(img, offsetX, offsetY, newWidth, newHeight);
}

let lastScrollTop = 0;
function handleScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const direction = st > lastScrollTop ? 1 : -1;
    lastScrollTop = st;

    gsap.to(frame, {
        currentIndex: Math.max(0, Math.min(frame.currentIndex + direction, frame.maxIndex)),
        duration: 0.1,
        onUpdate: () => {
            drawImage(Math.round(frame.currentIndex));
        }
    });
}

window.addEventListener('load', async () => {
    try {
        await preloadImages();
        console.log("Image preloading completed.");
        drawImage(frame.currentIndex);
        
        gsap.to(window, {
            scrollTrigger: {
                trigger: "#page2-container",
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const newIndex = Math.round(progress * frame.maxIndex);
                    if (newIndex !== frame.currentIndex) {
                        frame.currentIndex = newIndex;
                        drawImage(frame.currentIndex);
                    }
                },
                scrub: true,
            }
        });
    } catch (error) {
        console.error("Error during image preloading:", error);
    }
});

window.addEventListener('resize', () => {
    drawImage(frame.currentIndex);
});
gsap.to("#scroll", {
  scrollTrigger: {
    trigger: "#page2-container",
    start: "top top",
    scrub: true,
  },
  scale: 0,
  ease: "power2.out",
  opacity: 0, // Add opacity animation
  duration: 1, // Add a duration for smoother animation
  onComplete: function() {
    document.getElementById('scroll').style.display = 'none'; // Hide element after animation
  }
})
 const carbon = [
   '2015.png',
   '2016.png',
   '2017.png',
   '2018.png',
   '2019.png',
   '2020.png',
   '2021.png',
   '2022.png',
   
 ]
 var left = document.getElementById('left');
 var right = document.getElementById('right');
 var map_year = document.getElementById('map-year');
 var map_count = 0; 

 right.addEventListener('click', () => {
    if(map_count < carbon.length-1){    
        map_count++;
        map_year.textContent = `December ${carbon[map_count].split('.')[0]}`;
        map.innerHTML=`  <img src="carbon Gas emission/${carbon[map_count]}" alt="" style="width:100%;height:100%;object-fit: cover;">`
    }
 
 })

 left.addEventListener('click', () => {
   if (map_count > 0) {
     map_count--;
     map_year.textContent = `December ${carbon[map_count].split('.')[0]}`;
     map.innerHTML = `<img src="carbon Gas emission/${carbon[map_count]}" alt="" style="width:100%;height:100%;object-fit: cover;">`;
   }
 })

 var ri_menu_line = document.getElementById('ri-menu-line');
 var ri_close_line = document.getElementById('ri-close-line');
  var nav = document.getElementById('nav');
 ri_menu_line.addEventListener('click',()=>{
     gsap.fromTo("#slider",{
   
    },{
      x:0,
      duration: 1,
      ease: "power2.out",
    })
    ri_menu_line.style.display = 'none';
    ri_close_line.style.display = 'block';

 })
 ri_close_line.addEventListener('click',()=>{
    gsap.fromTo("#slider",{
  
   },{
     x:-500,
     duration: 1,
     ease: "power2.out",
   })
ri_menu_line.style.display = 'block';
   ri_close_line.style.display = 'none';

})



 var temperature = document.getElementById('temperature');
 var co2 = document.getElementById('co2');
 var fossil_fuel = document.getElementById('fossil-fuel');
 var page1 = document.getElementById('page1');
 var page2 = document.getElementById('page2');
 var body = document.querySelector('body');
 var map_container = document.getElementById('map-container');
 var top_page = document.getElementById('top_page');
 var map = document.getElementById('map');
 var text = document.getElementById('text');
 var heading = document.getElementById('heading');
 var sences_container = document.getElementById('sences_container');
 var act = document.getElementById('act');
 var orbit = document.getElementById('orbit');

 temperature.addEventListener('click', () => {
    picture_img.style.display = 'none';
    map.style.display = 'block';
    top_page.style.display = 'block';
   page1.style.display = 'none';
   page2.style.backgroundColor = 'black';
   page2.style.display = 'block';
   body.style.overflow = 'auto';

 });


 co2.addEventListener('click', () => {
    population.style.display = 'none';
    sea.style.display = 'none';
   picture.style.display = 'none';
   map.style.display = 'block';
   top_page.style.display = 'block';
   act.style.display = 'none';
   heading.style.display = 'none';
   sences_container.style.display = 'none';
   text.style.display = 'none';
   page2.style.display = 'none';
   canvas.style.display = 'none';
  
 });

const fossil_fuel_year = [
  '2000.png',
  '2005.png',
  '2010.png',
  '2015.png',
  '2020.png',
  '2022.png',
]
var heading_button_left = document.getElementById('heading-button-left');
var heading_button_right = document.getElementById('heading-button-right');
var part_fule = document.getElementById('part-fule');

const count_fule = 0 ; 

 fossil_fuel.addEventListener('click', () => {
    part_fule.style.display = 'block';
    population.style.display = 'none';
    sea.style.display = 'none';
  picture.style.display = 'none';
    heading_button_left.style.display = 'block';
    canvas.style.display = 'block';
    map.style.display = 'none';
    top_page.style.display = 'none';
    page2.style.display = 'none';
    act.style.display = 'none';
    heading.style.display = 'block';
    sences_container.style.display = 'none';
    text.style.display = 'none';
    page1.style.backgroundColor = 'black';
    document.querySelector('#heading-content').style.opacity = '1';

    let currentIndex = 0;

    const updateTexture = () => {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(`/fossil fuel/${fossil_fuel_year[currentIndex]}`, () => {
            sphere.material.map = texture;
            sphere.material.needsUpdate = true;
        });
        document.querySelector('#heading h1').innerHTML = `<h4 > Fossil Fuel </h4> <h4 style="padding:0;margin-top:-10px;"> ${fossil_fuel_year[currentIndex].split('.')[0]} </h4>`;
    };

    updateTexture();



    heading_button_left.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % fossil_fuel_year.length;
        updateTexture();
    });
    

    sphere.rotation.x = 0;
    sphere2.scale.set(0.5, 0.5, 0.5); // Decrease the size of sphere2
 });

 ice.addEventListener('click', () => {
  sea.style.display = 'none';
  part_fule.style.display = 'none';
  population.style.display = 'none';
  picture.style.display = 'block';
  text.style.display = 'none';
  heading.style.display = 'none';
  sences_container.style.display = 'none';
  act.style.display = 'none';
  page2.style.display = 'none';
  canvas.style.display = 'none';
 })

var picture_img = document.getElementById('picture-img');
var slider_1 = document.getElementById('slider_1');
picture_img.src = `/ice/frame_0001.jpeg`;

// Array of image paths for ice shape melting
const iceImages = Array.from({length: 50}, (_, i) => `/ice/frame_${String(i).padStart(4, '0')}.jpeg`);

// Function to update the image based on slider value
function updateIceImage(value) {
    console.log(value);
    // Convert value to integer to ensure proper comparison
    value = parseInt(value);
    
    if (value === 0) {
        picture_img.src = `/ice/frame_0001.jpeg`;
    } else if (value === 50) {
        picture_img.src = `/ice/frame_0050.jpeg`;
    } else {
        // Adjust index to match array (0-49 instead of 1-50)
        picture_img.src = iceImages[value - 1];
    }
}

// Event listener for slider change
slider_1.addEventListener('input', function() {
    updateIceImage(this.value);
});

// Initialize with the first image
updateIceImage(0);


var sea_level = document.getElementById('sea_level');
part_fule.style.display = 'none';
var sea = document.getElementById('sea');
sea_level.addEventListener('click', () => {
    sea.style.display = 'block';
    population.style.display = 'none';
    canvas.style.display = 'none';
    picture.style.display = 'none';
    map.style.display = 'none';
    top_page.style.display = 'none';
    page2.style.display = 'none';
    act.style.display = 'none';
    heading.style.display = 'none';
    text.style.display = 'none';
    sences_container.style.display = 'none';
})

var population_button = document.getElementById('population_button');
part_fule.style.display = 'none';
population_button.addEventListener('click', () => {
    population.style.display = 'block';
    sea.style.display = 'none';
    canvas.style.display = 'none';
    picture.style.display = 'none';
    map.style.display = 'none';
    top_page.style.display = 'none';
    page2.style.display = 'none';
    act.style.display = 'none';
    heading.style.display = 'none';
    text.style.display = 'none';
    sences_container.style.display = 'none';

})

  var population_img = document.getElementById('population-img');
  var population_heading = document.getElementById('population-heading');
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      population_img.src = 'methen/2.png';
      population_heading.innerHTML = `<h4 > Methane Emission </h4> <h4 style="padding:0;margin-top:-10px;"> 2022 </h4>`;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      population_img.src = 'methen/1.png';
    }   population_heading.innerHTML = `<h4 > Methane Emission </h4> <h4 style="padding:0;margin-top:-10px;"> 2000 </h4>`;
  });

