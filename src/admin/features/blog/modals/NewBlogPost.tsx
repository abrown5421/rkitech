import React, { useState } from "react";
import Container from "../../../../shared/components/container/Container";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Input from "../../../../shared/components/input/Input";
import Select from "../../../../shared/components/select/Select";
import Button from "../../../../shared/components/button/Button";
import type {
  NewBlogPostFormErrors,
  NewBlogPostFormHelperTexts,
  NewBlogPostFormValues,
} from "../blogEditorTypes";
import { insertDataIntoCollection } from "../../../../services/database/createData";
import { setNotLoading } from "../../../../app/globalSlices/loading/loadingSlice";
import { openAlert } from "../../../../shared/features/alert/alertSlice";
import { getRandomTrianglifyParams } from "../../../../shared/components/trianglifyBanner/getRandomTrianglifyParams";
import { preCloseModal } from "../../../../shared/features/modal/modalSlice";

const NewBlogPost: React.FC = () => {
  const dispatch = useAppDispatch();
  const postsFromStore = useAppSelector((state) => state.blog.blogPosts);
  const categories = [
    ...new Set(postsFromStore.map((post) => post.postCategory).filter(Boolean)),
  ];

  const [formValues, setFormValues] = useState<NewBlogPostFormValues>({
    title: "",
    category: "",
    synopsis: "",
  });

  const [formErrors, setFormErrors] = useState<NewBlogPostFormErrors>({
    title: false,
    category: false,
    synopsis: false,
  });

  const [helperTexts, setHelperTexts] = useState<NewBlogPostFormHelperTexts>({
    title: "",
    category: "",
    synopsis: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: false }));
    setHelperTexts((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    let valid = true;

    const newErrors: NewBlogPostFormErrors = {
      title: false,
      category: false,
      synopsis: false,
    };
    const newHelperTexts: NewBlogPostFormHelperTexts = {
      title: "",
      category: "",
      synopsis: "",
    };

    if (!formValues.title.trim()) {
      newErrors.title = true;
      newHelperTexts.title = "Post Name is required";
      valid = false;
    }

    if (!formValues.category.trim()) {
      newErrors.category = true;
      newHelperTexts.category = "Category is required";
      valid = false;
    }

    if (!formValues.synopsis.trim()) {
      newErrors.synopsis = true;
      newHelperTexts.synopsis = "Post Synopsis is required";
      valid = false;
    }

    setFormErrors(newErrors);
    setHelperTexts(newHelperTexts);

    if (valid) {
      try {
        const triBan = getRandomTrianglifyParams();
        const randomizedTrianglifyBanner = {
          xColors: triBan.xColor,
          yColors: triBan.yColor,
          width: "w-full",
          height: 150,
          variance: triBan.variance,
          cellSize: triBan.cellSize,
        };

        const completePostObj = {
          postActive: false,
          postAuthor: "Rkitech Blog",
          postCategory: formValues.category,
          postSynopsis: formValues.synopsis,
          postTitle: formValues.title,
          postDate: new Date().toISOString(),
          trianglifyObject: randomizedTrianglifyBanner,
          content: {
            type: "Container",
            props: {
              TwClassName: "flex-col",
            },
            children: [
              {
                type: "Text",
                props: {
                  text: formValues.synopsis,
                  TwClassName: "text-black mb-5",
                },
              },
            ],
          },
        };

        await insertDataIntoCollection("Blog", completePostObj);
        dispatch(preCloseModal());
        dispatch(
          openAlert({
            alertOpen: true,
            alertSeverity: "success",
            alertMessage: "New post created succesffully.",
            alertAnimation: {
              entranceAnimation: "animate__fadeInRight animate__faster",
              exitAnimation: "animate__fadeOutRight animate__faster",
              isEntering: true,
            },
          })
        );
      } catch (error) {
        dispatch(preCloseModal());
        console.error("Error toggling post active state:", error);
        dispatch(
          openAlert({
            alertOpen: true,
            alertSeverity: "error",
            alertMessage: "Failed to create a new post.",
            alertAnimation: {
              entranceAnimation: "animate__fadeInRight animate__faster",
              exitAnimation: "animate__fadeOutRight animate__faster",
              isEntering: true,
            },
          })
        );
      } finally {
        dispatch(setNotLoading());
      }
    }
  };

  return (
    <Container TwClassName="flex-col">
      <Container TwClassName="rounded-md flex-row gap-4 items-center">
        <Input
          TwClassName="flex-grow"
          label="Post Name"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          error={formErrors.title}
          helperText={helperTexts.title}
        />
        <Select
          TwClassName="flex-grow"
          label="Category"
          name="category"
          creatable={true}
          value={formValues.category}
          onChange={handleChange}
          error={formErrors.category}
          helperText={helperTexts.category}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Container>
      <Input
        TwClassName="flex-grow my-4"
        label="Post Synopsis"
        value={formValues.synopsis}
        onChange={handleChange}
        error={formErrors.synopsis}
        helperText={helperTexts.synopsis}
        rows={8}
        name="synopsis"
      />
      <Container TwClassName="rounded-md flex-row gap-4 justify-end">
        <Button
          TwClassName="pt-1 pr-3 pb-1 pl-3 bg-error rounded-xl text-white"
          onClick={() => {
            console.log("Cancel clicked");
          }}
        >
          Cancel
        </Button>
        <Button
          TwClassName="pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </Container>
    </Container>
  );
};

export default NewBlogPost;
