// Type definitions for the liquid-glass library

export interface GlassControls {
    blurRadius: number;
    edgeIntensity: number;
    rimIntensity: number;
    baseIntensity: number;
    edgeDistance: number;
    rimDistance: number;
    baseDistance: number;
    cornerBoost: number;
    rippleEffect: number;
    tintOpacity: number;
}

export interface ContainerOptions {
    borderRadius?: number;
    type?: 'rounded' | 'circle' | 'pill';
    tintOpacity?: number;
    captureTarget?: HTMLElement | null;
    backgroundColor?: string | null;
}

export interface ButtonOptions extends ContainerOptions {
    text?: string;
    size?: number;
    onClick?: (text: string) => void;
    warp?: boolean;
}

export interface Position {
    x: number;
    y: number;
}

export interface WebGLRefs {
    gl: WebGLRenderingContext;
    texture: WebGLTexture;
    textureSizeLoc: WebGLUniformLocation | null;
    scrollYLoc?: WebGLUniformLocation | null;
    positionLoc: number;
    texcoordLoc: number;
    resolutionLoc: WebGLUniformLocation | null;
    pageHeightLoc?: WebGLUniformLocation | null;
    viewportHeightLoc?: WebGLUniformLocation | null;
    blurRadiusLoc: WebGLUniformLocation | null;
    borderRadiusLoc: WebGLUniformLocation | null;
    containerPositionLoc: WebGLUniformLocation | null;
    warpLoc?: WebGLUniformLocation | null;
    edgeIntensityLoc: WebGLUniformLocation | null;
    rimIntensityLoc: WebGLUniformLocation | null;
    baseIntensityLoc: WebGLUniformLocation | null;
    edgeDistanceLoc: WebGLUniformLocation | null;
    rimDistanceLoc: WebGLUniformLocation | null;
    baseDistanceLoc: WebGLUniformLocation | null;
    cornerBoostLoc: WebGLUniformLocation | null;
    rippleEffectLoc: WebGLUniformLocation | null;
    tintOpacityLoc: WebGLUniformLocation | null;
    imageLoc: WebGLUniformLocation | null;
    positionBuffer: WebGLBuffer;
    texcoordBuffer: WebGLBuffer;
    // Button-specific
    buttonPositionLoc?: WebGLUniformLocation | null;
    containerSizeLoc?: WebGLUniformLocation | null;
}

export interface GlassChild {
    element?: HTMLElement | null;
    parent?: GlassChild;
    isNestedGlass?: boolean;
    gl_refs?: Partial<WebGLRefs>;
    setupAsNestedGlass?: () => void;
    canvas?: HTMLCanvasElement | null;
    width?: number;
    height?: number;
    webglInitialized?: boolean;
    getPosition?: () => Position;
}

// Extend Window interface
declare global {
    interface Window {
        html2canvas: (element: HTMLElement, options?: object) => Promise<HTMLCanvasElement>;
        glassControls?: GlassControls;
    }
}
