import type { Page } from "../../../shared/features/pages/pageTypes";

export interface PageEditorProps {
    localPageCompKey: string;
    localItemUUID: string;
    localPageObjectFromDb: Page | null;
    activePrefix?: 'xl' | 'lg' | 'md' | 'sm' | 'hover';
    activeEditorComponent: 'Container' | 'Text' | 'Image' | 'Icon' | 'Button' | 'List' | 'TrianglifyBanner' | undefined;
    activeEditorUUID: string | undefined;
}