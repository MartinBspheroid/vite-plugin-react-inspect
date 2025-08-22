#!/bin/bash

# Simple Migration Progress Tracker
# Shows current migration status and next steps

echo "🚀 Bun Migration Progress Tracker"
echo "================================="
echo ""

# Check current status
if [ -f "bun.lockb" ]; then
    echo "✅ Phase 1 (Package Manager): COMPLETED"
    PHASE1_DONE=true
else
    echo "⏳ Phase 1 (Package Manager): NOT STARTED"
    echo "   📋 Next: Backup pnpm-lock.yaml and install Bun"
    echo "   🔧 Command: cp pnpm-lock.yaml pnpm-lock.yaml.backup && bun install"
    PHASE1_DONE=false
fi

if [ "$PHASE1_DONE" = true ]; then
    if [ -f "packages/core/build.js" ]; then
        echo "✅ Phase 2 (Bundler): COMPLETED"  
        PHASE2_DONE=true
    else
        echo "⏳ Phase 2 (Bundler): NOT STARTED"
        echo "   📋 Next: Create Bun build script"
        echo "   📁 File: packages/core/build.js"
        PHASE2_DONE=false
    fi
fi

if [ "$PHASE2_DONE" = true ]; then
    if [ -f "packages/core/build-overlay.js" ]; then
        echo "✅ Phase 3 (Overlay): COMPLETED"
        PHASE3_DONE=true
    else
        echo "⏳ Phase 3 (Overlay): NOT STARTED" 
        echo "   📋 Next: Create overlay bundling script"
        echo "   📁 File: packages/core/build-overlay.js"
        PHASE3_DONE=false
    fi
fi

if [ "$PHASE3_DONE" = true ]; then
    if ! grep -q "unplugin" packages/core/package.json; then
        echo "✅ Phase 4 (Remove unplugin): COMPLETED"
        echo "🎉 Migration Complete!"
    else
        echo "⏳ Phase 4 (Remove unplugin): NOT STARTED"
        echo "   📋 Next: Convert to native Vite plugin API"
        echo "   📁 File: packages/core/src/index.ts"
    fi
fi

echo ""
echo "📊 Quick Commands:"
echo "   bun install                    # Phase 1: Install with Bun"
echo "   bun run build                  # Test current build"
echo "   bun run dev                    # Test development mode" 
echo "   bun run play:react             # Test in playground"
echo ""

# Show next recommended action
if [ "$PHASE1_DONE" = false ]; then
    echo "🎯 NEXT ACTION: Start Phase 1 - Package Manager Migration"
    echo "   1. Backup current setup: cp pnpm-lock.yaml pnpm-lock.yaml.backup"
    echo "   2. Remove pnpm artifacts: rm -rf node_modules packages/*/node_modules pnpm-lock.yaml"
    echo "   3. Install with Bun: bun install"
elif [ "$PHASE2_DONE" = false ]; then
    echo "🎯 NEXT ACTION: Start Phase 2 - Create Bun Build Script"
    echo "   1. Analyze current tsup.config.ts"
    echo "   2. Create packages/core/build.js with Bun.build API"
    echo "   3. Update package.json scripts"
elif [ "$PHASE3_DONE" = false ]; then
    echo "🎯 NEXT ACTION: Start Phase 3 - Simplify Overlay Bundling"
    echo "   1. Create build-overlay.js script"
    echo "   2. Update virtual module system"
    echo "   3. Remove generate-bundled-sources.js"
else
    echo "🎯 NEXT ACTION: Start Phase 4 - Remove unplugin"
    echo "   1. Convert to native Vite Plugin API"
    echo "   2. Remove unplugin dependency"
    echo "   3. Final testing"
fi