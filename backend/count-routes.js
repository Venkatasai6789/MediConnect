#!/usr/bin/env node
/**
 * MediConnect Route Counter and Validator
 * This script verifies all 43 routes are properly defined in the backend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDir = path.join(__dirname, 'routes');

console.log('🔍 Analyzing MediConnect Backend Routes...\n');
console.log('═'.repeat(60));

const routeFiles = [
  'auth.js',
  'users.js', 
  'doctors.js',
  'appointments.js',
  'patients.js',
  'medicines.js',
  'labTests.js',
  'chat.js',
  'payments.js',
  'healthReports.js'
];

const categoryInfo = {
  'auth.js': { name: 'AUTH', expectedRoutes: 7 },
  'users.js': { name: 'USER', expectedRoutes: 2 },
  'doctors.js': { name: 'DOCTOR', expectedRoutes: 8 },
  'appointments.js': { name: 'APPOINTMENT', expectedRoutes: 5 },
  'patients.js': { name: 'PATIENT', expectedRoutes: 3 },
  'medicines.js': { name: 'MEDICINE', expectedRoutes: 3 },
  'labTests.js': { name: 'LAB TEST', expectedRoutes: 3 },
  'chat.js': { name: 'CHAT', expectedRoutes: 5 },
  'payments.js': { name: 'PAYMENT', expectedRoutes: 3 },
  'healthReports.js': { name: 'HEALTH REPORT', expectedRoutes: 5 }
};

let totalRoutesExpected = 0;
let totalRoutesFound = 0;
let allRoutes = [];

routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Count router.get, router.post, router.put, router.delete, router.patch
  const routePattern = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
  const routes = [...content.matchAll(routePattern)];
  
  const category = categoryInfo[file];
  const count = routes.length;
  totalRoutesFound += count;
  totalRoutesExpected += category.expectedRoutes;
  
  const status = count === category.expectedRoutes ? '✅' : '⚠️ ';
  const emoji = count === category.expectedRoutes ? '' : ` (Expected: ${category.expectedRoutes}, Found: ${count})`;
  
  console.log(`${status} ${category.name.padEnd(15)} Routes: ${count}${emoji}`);
  
  routes.forEach(route => {
    const method = route[1].toUpperCase();
    const endpoint = route[2];
    allRoutes.push(`${method} ${endpoint}`);
  });
});

console.log('═'.repeat(60));
console.log(`\n📊 ROUTE SUMMARY`);
console.log('═'.repeat(60));
console.log(`Expected Routes: ${totalRoutesExpected}`);
console.log(`Found Routes:    ${totalRoutesFound}`);
console.log(`Status:          ${totalRoutesExpected === totalRoutesFound ? '✅ ALL ROUTES DEFINED' : '⚠️ MISMATCH'}`);
console.log('═'.repeat(60));

console.log('\n📋 ALL DEFINED ROUTES:\n');
allRoutes.sort().forEach((route, index) => {
  console.log(`  ${(index + 1).toString().padStart(2)}. ${route}`);
});

console.log(`\n✨ Total routes analyzed: ${totalRoutesFound}`);
console.log('\n💡 To test these routes, run: npm run dev (in backend folder)\n');
