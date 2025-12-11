import {
    Box,
    Typography,
    ImageList,
    ImageListItem,
    Tooltip,
    Pagination,
    TextField
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import DimensionPicker from "../dimensionPicker/DimensionPicker";
import { usePropEditor } from "../../../hooks/admin/usePropEditor";
import { useGetImagesQuery } from "../media/mediaApi";

const IMAGES_PER_PAGE = 15;

const ImageEditor: React.FC = () => {
    const { draft, activeProps, updateProp } = usePropEditor();
    const { data: images = [] } = useGetImagesQuery();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        console.log(images);
    }, [images]);

    if (!draft) return <Typography>Element not found</Typography>;

    const filteredImages = useMemo(() => {
        const query = search.toLowerCase();
        return images.filter((img) => img.name.toLowerCase().includes(query));
    }, [images, search]);

    const usePagination = filteredImages.length > IMAGES_PER_PAGE;
    const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

    const paginatedImages = usePagination
        ? filteredImages.slice((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE)
        : filteredImages;

    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Dimensions:</Typography>

            <DimensionPicker
                value={{
                    width: activeProps.sx?.width ?? "100px",
                    height: activeProps.sx?.height ?? "100px",
                }}
                onChange={(val) => {
                    updateProp("sx", {
                        ...activeProps.sx,
                        width: val.width,
                        height: val.height,
                    });
                }}
            />

            <Typography variant="h6">Source:</Typography>
            <TextField
                label="Search images"
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
            />

            <ImageList cols={3} gap={8}>
                {paginatedImages.map((img) => (
                    <Tooltip key={img.path} title={img.name} placement="top" arrow>
                        <ImageListItem
                            onClick={() => updateProp("src", img.path)}
                            sx={{
                                cursor: "pointer",
                                border:
                                    activeProps?.src === img.path
                                        ? "2px solid #1976d2"
                                        : "2px solid transparent",
                                borderRadius: 1,
                                overflow: "hidden",
                                transition: "0.2s",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <img
                                src={img.path}
                                alt={img.name}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </ImageListItem>
                    </Tooltip>
                ))}
            </ImageList>

            {filteredImages.length === 0 && (
                <Typography color="text.secondary" textAlign="center">
                    No images match your search.
                </Typography>
            )}

            {usePagination && filteredImages.length > 0 && (
                <Box display="flex" justifyContent="center" mt={1}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                        size="small"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ImageEditor;
