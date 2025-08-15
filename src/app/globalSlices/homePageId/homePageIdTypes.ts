import type { Page } from "../../../shared/features/pages/pageTypes";

export interface HomePageState {
    id: string;
    homePageObj: Page | null;
}