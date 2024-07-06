import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import './style.css';

let API_KEY = 'AIzaSyC1yolNE7C0OMKZxiqxzCgk3jei2MDM3-Y';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

const PREPROMPT = `Imagine you are a bot name Summit AI. You will learning my product that is:
Product 1: AMTI AccuGait-Optimized (ACG-O)

Product Name: AMTI AccuGait-Optimized (ACG-O)

Product Description:
A portable multi-axis force platform for quantifying human gait and balance, featuring a plug-and-play USB interface and high accuracy.

Key Features:

    USB interface with automatic synchronization
    Precision grid OPTIMA calibration technology
    Easy setup with a single 15 ft cable
    Portable design with handle and wheels

Use Cases:

    Gait Analysis: Accurate force and pressure measurements
    Balance Assessments: Portable and precise data collection
    Ease of Use: No need for permanent mounting
    Portability: Lightweight and easy to transport

Summary:
Versatile and portable, ideal for clinical and research settings.
Product 2: VICON SuperNova

Product Name: VICON SuperNova

Product Description:
High-performance active LED strand for tracking props and objects in large and occluded motion capture volumes, ideal for virtual production.

Key Use Cases:

    Virtual Production: Accurate tracking with 270-degree visibility
    Location-Based VR: Customizable marker layouts and easy setup
    Compatibility: Works with various VICON cameras

Summary:
Enhances prop and object tracking in virtual production and VR applications.
Product 3: AMTI Filler Force Plates

Product Name: AMTI Filler Force Plates

Product Description:
Customizable force plates available in quarter, half, and full lengths for various applications.

Key Use Cases:

    Flexibility: Configurable setups for different spaces
    Applications: Gait analysis, balance assessments, jump and landing analysis, squat testing
    Expertise: Utilizes AMTI’s Optima calibration technology

Summary:
Provides flexibility and precision for force measurement, ideal for research and clinical use.
Product 4: VICON Valkyrie

Product Name: VICON Valkyrie

Product Description:
Sophisticated motion capture system with high precision and flexibility.

Key Features:

    Sub-millimeter accuracy
    High-speed and high frame rate
    Adaptable to various environments
    Integration with software platforms

Use Cases:

    Sports Performance: Biomechanics analysis to enhance performance
    Film and Animation: Captures detailed actor movements for realistic animation
    VR and Gaming: Real-time motion capture for immersive experiences

Summary:
Versatile motion capture system for sports, entertainment, and VR applications.
Product 5: AMTI Force Plate Stairs

Product Name: AMTI Force Plate Stairs

Product Description:
Specialized tool for measuring forces exerted during stair navigation.

Key Features:

    High-precision measurement of forces and moments
    Multiple steps equipped with force plates
    Real-time data integration

Use Cases:

    Gait Analysis: Analyzes patient gait in rehabilitation
    Biomechanics Research: Studies force distribution in elderly individuals
    Sports Science: Optimizes athlete performance through force analysis

Summary:
Enhances understanding of human movement for rehabilitation, research, and sports.
Product 6: VICON Calibration Wand

Product Name: VICON Calibration Wand

Product Description:
Tool for calibrating motion capture cameras to ensure accurate tracking.

Key Features:

    Precision tool with reflective markers
    Available in various lengths
    Durable construction

Use Cases:

    Camera Calibration: Aligns and ensures accuracy of cameras
    System Accuracy: Maintains precision in motion capture setups
    Troubleshooting: Resolves calibration issues

Summary:
Essential for accurate motion capture calibration in film, animation, and research.

`;

const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

const chat = model.startChat({
  history: [
    {
      role: 'user',
      parts: [{ text: PREPROMPT }],
    }
  ],
  generationConfig:{
    maxOutputTokens: 200
  }
});


form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
   const prompt = promptInput.value;
   
    const result = await chat.sendMessageStream(prompt);
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};



