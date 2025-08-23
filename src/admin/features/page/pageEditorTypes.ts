
import type { Page } from "../../../shared/features/pages/pageTypes";

export interface PageEditorProps {
    localPageCompKey: string;
    localPageObjectFromDb: Page | null;
    activePrefix?: 'xl' | 'md' | '';
    hover?: boolean;
    activeEditorComponent: 'Container' | 'Text' | 'Image' | 'Icon' | 'Button' | 'List' | 'TrianglifyBanner' | undefined;
    activeEditorUUID: string | undefined;
    enterExit: boolean;
}
