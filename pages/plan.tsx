import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings/index";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import RadialProgress from "@/components/RadialProgress";

import { useAuthValues } from "@/contexts/contextAuth";

import usePlan from "@/hooks/usePlan";

import { IPlan } from "@/interfaces/IPlan";
import { DEFAULT_CURRENCY, ICurrency } from "@/interfaces/ICurrency";
import useCurrency from "@/hooks/useCurrency";
import Select from "@/components/Select";
import PlanTable from "@/components/PlanTable";
import { FILE_TYPE } from "@/libs/constants";

export default function Plan() {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    loadingProgress,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  } = usePlan();
  const { fetchCurrencies } = useCurrency();

  const [currencies, setCurrencies] = useState<Array<ICurrency>>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [plans, setPlans] = useState<Array<IPlan>>([]);
  const [isDetailViewOpened, setIsDetailViewOpened] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUploaded, setImageFileUploaded] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(5);
  const [duration, setDuration] = useState<number>(30);
  const [currency, setCurrency] = useState<ICurrency>(DEFAULT_CURRENCY);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const clearFields = () => {
    setImageFile(null);
    setName("");
    setDescription("");
    setPrice(5);
    setDuration(30);
  };

  const onCurrencyChanged = (value: string) => {
    const selectedCurrencyId = Number(value);
    const index = currencies.findIndex((item) => {
      return item.id == selectedCurrencyId;
    });
    if (index >= 0) {
      setCurrency(currencies[index]);
    }
  };

  const onConfirm = () => {
    if (
      (!isEditing && !imageFile) ||
      !name ||
      !description ||
      price <= 0 ||
      duration <= 0
    ) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updatePlan(
        selectedId,
        imageFile,
        name,
        description,
        price,
        duration,
        currency.id
      ).then((value) => {
        if (value) {
          clearFields();
          fetchPlans().then((value) => {
            if (value) {
              setPlans(value);
            }
          });

          toast.success("Successfully updated!");
        }
      });
    } else {
      createPlan(
        imageFile!,
        name,
        description,
        price,
        duration,
        currency.id
      ).then((value) => {
        if (value) {
          clearFields();
          fetchPlans().then((value) => {
            if (value) {
              setPlans(value);
            }
          });

          toast.success("Successfully added!");
        }
      });
    }

    setIsDetailViewOpened(false);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPlans().then((value) => {
        if (value) {
          setPlans(value);
        }
      });

      fetchCurrencies().then((value) => {
        if (value) {
          setCurrencies(value);
          if (value.length > 0) {
            setCurrency(value[0]);
          }
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const tableView = (
    <div className="w-full">
      <div className="w-full flex justify-start items-center p-5">
        <div className="w-40">
          <ButtonSettings
            label="Add"
            bgColor="cyan"
            onClick={() => {
              clearFields();
              setIsEditing(false);
              setIsDetailViewOpened(true);
            }}
          />
        </div>
      </div>
      <div className="w-full p-5">
        <PlanTable
          plans={plans}
          deletePlan={(id: number) =>
            deletePlan(id).then((value) => {
              if (value) {
                fetchPlans().then((value) => {
                  if (value) {
                    setPlans(value);
                  }
                });

                toast.success("Successfully deleted!");
              }
            })
          }
          updatePlan={(id: number) => {
            setIsEditing(true);
            const index = plans.findIndex((plan) => plan.id == id);
            if (index >= 0) {
              setName(plans[index].name);
              setDescription(plans[index].description);
              setImageFile(null);
              setImageFileUploaded(plans[index].coverImage);
              setPrice(plans[index].price);
              setDuration(plans[index].duration);
              setCurrency(plans[index].currency);
              setSelectedId(id);
              setIsDetailViewOpened(true);
            }
          }}
        />
      </div>
    </div>
  );

  const detailContentViiew = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 flex justify-center items-center p-5">
      <div className="mt-16 p-5 w-full bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} Plan
        </label>
        <div className="flex">
          <div className="w-full px-0 flex flex-col">
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextInput
                sname="Plan Name"
                label=""
                placeholder="Enter Plan Name"
                type="text"
                value={name}
                setValue={setName}
              />
              <TextInput
                sname="Short Description"
                label=""
                placeholder="Enter Short Description"
                type="text"
                value={description}
                setValue={setDescription}
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextInput
                sname="Plan Price"
                label=""
                placeholder="Enter Plan Price"
                type="number"
                value={price}
                setValue={(value: string) => setPrice(Number(value))}
              />
              <TextInput
                sname="Plan Duration (days)"
                label=""
                placeholder="Plan Duration"
                type="number"
                value={duration}
                setValue={(value: string) => setDuration(Number(value))}
              />
              <Select
                defaultValue={""}
                defaultLabel="Select Currency"
                value={currency.id ?? ""}
                setValue={(value: string) => onCurrencyChanged(value)}
                label="Select Currency"
                options={currencies.map((currency) => {
                  return {
                    label: currency.name,
                    value: currency.id ? currency.id.toString() : "",
                  };
                })}
              />
            </div>
            <ButtonUpload
              id="upload_plan_cover_image"
              label="Upload Plan Cover Image"
              file={imageFile}
              setFile={setImageFile}
              fileType={FILE_TYPE.IMAGE}
              uploaded={imageFileUploaded}
            />

            <div className="flex space-x-2 mt-5">
              <ButtonSettings
                label="Cancel"
                onClick={() => setIsDetailViewOpened(false)}
              />
              <ButtonSettings bgColor="cyan" label="Save" onClick={onConfirm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex justify-center items-start overflow-x-hidden overflow-y-auto">
        {isDetailViewOpened ? detailContentViiew : tableView}

        {isLoading && (
          <div className="loading w-[50px] h-[50px]">
            {loadingProgress > 0 ? (
              <div className="w-20 h-20">
                <CircularProgressbar
                  styles={buildStyles({
                    pathColor: "#0052e4",
                    textColor: "#ffffff",
                    trailColor: "#888888",
                  })}
                  value={loadingProgress}
                  maxValue={100}
                  text={`${loadingProgress}%`}
                />
              </div>
            ) : (
              <RadialProgress width={50} height={50} />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
