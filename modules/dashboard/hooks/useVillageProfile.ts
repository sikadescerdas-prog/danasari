import { useState, useEffect, useCallback, useRef } from "react";
import { phoneToDisplay, phoneToSave } from "@/shared/helpers/phone";
import { villageProfileService } from "@/modules/dashboard/services/villageProfile.service";
import { villageProfileHelper } from "@/modules/dashboard/cloudinary/upload.profile";
import sweet from "@/shared/utils/sweet";

export const useVillageProfile = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    foundedYear: "",
    areaSize: "",
    vision: "",
    mission: "",
    welcomeMessage: "",
    locationUrl: "",
    history: "", // ✅ ADD HISTORY

    logo: null,

    address: {
      detailAddress: "",
      rt: "",
      rw: "",
      village: "",
      district: "",
      regency: "",
      province: "",
      postalCode: "",
      north: "",
      south: "",
      east: "",
      west: "",
    },

    socialMedia: {
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: "",
    },
  });

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logoToDelete, setLogoToDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const logoPublicIdRef = useRef<string>("");

  // LOAD
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await villageProfileService.get();

      const hasLogo = data.logo?.publicId && data.logo?.url;
      setIsFirstTime(!hasLogo);

      setFormData({
        ...data,

        name: data.name || "",
        phone: data.phone ? phoneToDisplay(data.phone) : "",
        email: data.email || "",

        foundedYear: data.foundedYear ? String(data.foundedYear) : "",
        areaSize: data.areaSize ? String(data.areaSize) : "",

        vision: data.vision || "",
        mission: data.mission || "",
        welcomeMessage: data.welcomeMessage || "",
        locationUrl: data.locationUrl || "",

        history: data.history || "", // ✅ ADD

        address: {
          detailAddress: data.address?.detailAddress || "",
          rt: data.address?.rt || "",
          rw: data.address?.rw || "",
          village: data.address?.village || "",
          district: data.address?.district || "",
          regency: data.address?.regency || "",
          province: data.address?.province || "",
          postalCode: data.address?.postalCode || "",
          north: data.address?.north || "",
          south: data.address?.south || "",
          east: data.address?.east || "",
          west: data.address?.west || "",
        },

        socialMedia: {
          facebook: data.socialMedia?.facebook || "",
          instagram: data.socialMedia?.instagram || "",
          tiktok: data.socialMedia?.tiktok || "",
          youtube: data.socialMedia?.youtube || "",
        },
      });

      logoPublicIdRef.current = data.logo?.publicId || "";

      setPreviewFile(null);
      setPreviewUrl(null);
      setLogoToDelete(false);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSosmedChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [field]: value },
    }));
  };

  // PREVIEW ONLY
  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(url);
    setLogoToDelete(false);
  };

  const handleDeleteLogo = () => {
    setFormData((prev: any) => ({ ...prev, logo: null }));
    setPreviewFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setLogoToDelete(true);
  };

  // SAVE
  const save = async () => {
    if (isFirstTime && !previewFile && !formData.logo?.url) {
      sweet.warning({
        title: "Logo Wajib!",
        text: "Silakan upload logo desa terlebih dahulu",
      });
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      let logoData = formData.logo;

      // upload logo baru
      if (previewFile) {
        setIsUploading(true);

        if (logoPublicIdRef.current) {
          await villageProfileHelper.deleteLogo(
            logoPublicIdRef.current
          );
        }

        const result =
          await villageProfileHelper.uploadLogo(previewFile);

        logoData = {
          publicId: result.publicId,
          url: result.url,
        };

        logoPublicIdRef.current = result.publicId;
        setIsUploading(false);
      }

      // delete logo
      else if (logoToDelete && logoPublicIdRef.current) {
        setIsUploading(true);

        await villageProfileHelper.deleteLogo(
          logoPublicIdRef.current
        );

        logoData = null;
        logoPublicIdRef.current = "";
        setIsUploading(false);
      }

      const payload: any = {
        ...formData,

        logo: logoData,

        phone: formData.phone
          ? phoneToSave(formData.phone)
          : "",

        foundedYear: formData.foundedYear
          ? Number(formData.foundedYear)
          : "",

        areaSize: formData.areaSize || "",

        history: formData.history || "", // ✅ ADD

        address: {
          ...formData.address,
        },
      };

      await villageProfileService.update(payload);

      sweet.success({
        title: "Berhasil",
        text: "Data desa berhasil disimpan",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      // reset preview
      setPreviewFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setLogoToDelete(false);
      setIsFirstTime(false);
    } catch (err: any) {
      sweet.error({
        title: "Gagal",
        text: err?.message || "Gagal menyimpan data",
      });
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewFile(null);
    setPreviewUrl(null);
    setLogoToDelete(false);

    loadProfile();
  };

  return {
    formData,
    isLoading,
    isSaving,
    isUploading,
    error,
    isFirstTime,
    previewFile,
    previewUrl,
    handleChange,
    handleAddressChange,
    handleSosmedChange,
    handleFileSelect,
    handleDeleteLogo,
    handleCancel,
    save,
  };
};