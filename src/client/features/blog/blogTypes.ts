import type { TrianglifyBannerProps } from "../../../shared/components/trianglifyBanner/trianglifyBannerTypes";

export interface BlogPost {
    postAuthor: string;
    postBody: string;
    postSynopsis: string;
    postCategory: string;
    postDate: string;
    trianglifyObject: TrianglifyBannerProps;
    postTitle: string;
    postActive: boolean;
}

export interface Blog {
    blogPosts: BlogPost[]
}