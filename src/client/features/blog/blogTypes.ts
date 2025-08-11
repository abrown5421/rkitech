import type { TrianglifyBannerProps } from "../../../shared/components/trianglifyBanner/trianglifyBannerTypes";

export interface BlogPostComponent {
  type: string;
  props?: {
    [key: string]: any; 
    children?: BlogPostComponent[]; 
  };
}

export interface BlogPost {
    blogPostID: string;
    postAuthor: string;
    content: BlogPostComponent[]; 
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