// components/dashboard/population/PopulationForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import InputGoogle from "@/components/ui/InputGoogle";
import { FaTimes } from "react-icons/fa";
import { formatRibuan, parseRibuan } from "@/shared/utils/formatRibuan";

import type { FormPopulation } from "@/modules/desa/types/villagePopulation.type";

type Props = {
  population?: any;
  onSave: (form: FormPopulation) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export default function PopulationForm({ population, onSave, onCancel, isSaving }: Props) {
  const [year, setYear] = useState("");
  const [totalKK, setTotalKK] = useState("");
  const [male, setMale] = useState("");
  const [female, setFemale] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [islam, setIslam] = useState("");
  const [kristen, setKristen] = useState("");
  const [katolit, setKatolit] = useState("");
  const [hindu, setHindu] = useState("");
  const [buddha, setBuddha] = useState("");
  const [konghucu, setKonghucu] = useState("");
  const [agamaLain, setAgamaLain] = useState("");
  const [disabilitas, setDisabilitas] = useState("");
  const [belumSekolah, setBelumSekolah] = useState("");
  const [sd, setSd] = useState("");
  const [smp, setSmp] = useState("");
  const [sma, setSma] = useState("");
  const [diploma, setDiploma] = useState("");
  const [sarjana, setSarjana] = useState("");
  const [pascasarjana, setPascasarjana] = useState("");
  const [farmer, setFarmer] = useState("");
  const [entrepreneur, setEntrepreneur] = useState("");
  const [employee, setEmployee] = useState("");
  const [government, setGovernment] = useState("");
  const [student, setStudent] = useState("");
  const [pekerjaanLain, setPekerjaanLain] = useState("");

  useEffect(() => {
    if (population) {
      setYear(population.year || "");
      setTotalKK(population.totalKK ? formatRibuan(population.totalKK) : "");
      setMale(population.male ? formatRibuan(population.male) : "");
      setFemale(population.female ? formatRibuan(population.female) : "");
      setRt(population.rt ? formatRibuan(population.rt) : "");
      setRw(population.rw ? formatRibuan(population.rw) : "");
      setIslam(population.islam ? formatRibuan(population.islam) : "");
      setKristen(population.kristen ? formatRibuan(population.kristen) : "");
      setKatolit(population.katolik ? formatRibuan(population.katolik) : "");
      setHindu(population.hindu ? formatRibuan(population.hindu) : "");
      setBuddha(population.buddha ? formatRibuan(population.buddha) : "");
      setKonghucu(population.konghucu ? formatRibuan(population.konghucu) : "");
      setAgamaLain(population.agamaLain ? formatRibuan(population.agamaLain) : "");
      setDisabilitas(population.disabilitas ? formatRibuan(population.disabilitas) : "");
      setBelumSekolah(population.belumSekolah ? formatRibuan(population.belumSekolah) : "");
      setSd(population.sd ? formatRibuan(population.sd) : "");
      setSmp(population.smp ? formatRibuan(population.smp) : "");
      setSma(population.sma ? formatRibuan(population.sma) : "");
      setDiploma(population.diploma ? formatRibuan(population.diploma) : "");
      setSarjana(population.sarjana ? formatRibuan(population.sarjana) : "");
      setPascasarjana(population.pascasarjana ? formatRibuan(population.pascasarjana) : "");
      setFarmer(population.farmer ? formatRibuan(population.farmer) : "");
      setEntrepreneur(population.entrepreneur ? formatRibuan(population.entrepreneur) : "");
      setEmployee(population.employee ? formatRibuan(population.employee) : "");
      setGovernment(population.government ? formatRibuan(population.government) : "");
      setStudent(population.student ? formatRibuan(population.student) : "");
      setPekerjaanLain(population.pekerjaanLain ? formatRibuan(population.pekerjaanLain) : "");
    } else {
      resetForm();
    }
  }, [population]);

  const resetForm = () => {
    setYear(""); setTotalKK(""); setMale(""); setFemale("");
    setRt(""); setRw(""); setIslam(""); setKristen(""); setKatolit("");
    setHindu(""); setBuddha(""); setKonghucu(""); setAgamaLain("");
    setDisabilitas(""); setBelumSekolah(""); setSd(""); setSmp(""); setSma("");
    setDiploma(""); setSarjana(""); setPascasarjana(""); setFarmer("");
    setEntrepreneur(""); setEmployee(""); setGovernment(""); setStudent("");
    setPekerjaanLain("");
  };

  const isEdit = !!population;

  const handleRibuan = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, "");
    const formatted = raw ? formatRibuan(parseInt(raw) || 0) : "";
    setter(formatted);
  };

  const toDB = (val: string) => (val ? parseRibuan(val) : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      year: year || undefined,
      totalKK: toDB(totalKK),
      male: toDB(male),
      female: toDB(female),
      rt: toDB(rt),
      rw: toDB(rw),
      islam: toDB(islam),
      kristen: toDB(kristen),
      katolik: toDB(katolit),
      hindu: toDB(hindu),
      buddha: toDB(buddha),
      konghucu: toDB(konghucu),
      agamaLain: toDB(agamaLain),
      disabilitas: toDB(disabilitas),
      belumSekolah: toDB(belumSekolah),
      sd: toDB(sd),
      smp: toDB(smp),
      sma: toDB(sma),
      diploma: toDB(diploma),
      sarjana: toDB(sarjana),
      pascasarjana: toDB(pascasarjana),
      farmer: toDB(farmer),
      entrepreneur: toDB(entrepreneur),
      employee: toDB(employee),
      government: toDB(government),
      student: toDB(student),
      pekerjaanLain: toDB(pekerjaanLain),
    });
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
      <h3 className="text-base font-bold text-gray-800">{children}</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-4 md:p-6 space-y-5">
      <h3 className="text-lg font-bold text-gray-900">{isEdit ? `Edit Populasi ${year}` : "Tambah Data"}</h3>

      <SectionLabel>Tahun</SectionLabel>
      <InputGoogle name="year" label="Tahun" value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} placeholder="2025" maxLength={4} disabled={isEdit} />

      <SectionLabel>KK & Penduduk</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGoogle name="totalkk" label="Total KK" value={totalKK} onChange={handleRibuan(setTotalKK)} placeholder="0" />
        <InputGoogle name="male" label="Laki-laki" value={male} onChange={handleRibuan(setMale)} placeholder="0" />
        <InputGoogle name="female" label="Perempuan" value={female} onChange={handleRibuan(setFemale)} placeholder="0" />
      </div>

      <SectionLabel>Wilayah</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGoogle name="rt" label="RT" value={rt} onChange={handleRibuan(setRt)} placeholder="0" />
        <InputGoogle name="rw" label="RW" value={rw} onChange={handleRibuan(setRw)} placeholder="0" />
      </div>

      <SectionLabel>Agama</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InputGoogle name="islam" label="Islam" value={islam} onChange={handleRibuan(setIslam)} placeholder="0" />
        <InputGoogle name="kristen" label="Kristen" value={kristen} onChange={handleRibuan(setKristen)} placeholder="0" />
        <InputGoogle name="katolit" label="Katolik" value={katolit} onChange={handleRibuan(setKatolit)} placeholder="0" />
        <InputGoogle name="hindu" label="Hindu" value={hindu} onChange={handleRibuan(setHindu)} placeholder="0" />
        <InputGoogle name="buddha" label="Buddha" value={buddha} onChange={handleRibuan(setBuddha)} placeholder="0" />
        <InputGoogle name="konghucu" label="Konghucu" value={konghucu} onChange={handleRibuan(setKonghucu)} placeholder="0" />
        <InputGoogle name="agamalain" label="Agama Lain" value={agamaLain} onChange={handleRibuan(setAgamaLain)} placeholder="0" />
      </div>

      <SectionLabel>Disabilitas</SectionLabel>
      <InputGoogle name="disabilitas" label="Disabilitas" value={disabilitas} onChange={handleRibuan(setDisabilitas)} placeholder="0" />

      <SectionLabel>Pendidikan</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <InputGoogle name="belumsekolah" label="Belum Sekolah" value={belumSekolah} onChange={handleRibuan(setBelumSekolah)} placeholder="0" />
        <InputGoogle name="sd" label="SD" value={sd} onChange={handleRibuan(setSd)} placeholder="0" />
        <InputGoogle name="smp" label="SMP" value={smp} onChange={handleRibuan(setSmp)} placeholder="0" />
        <InputGoogle name="sma" label="SMA" value={sma} onChange={handleRibuan(setSma)} placeholder="0" />
        <InputGoogle name="diploma" label="Diploma" value={diploma} onChange={handleRibuan(setDiploma)} placeholder="0" />
        <InputGoogle name="sarjana" label="Sarjana" value={sarjana} onChange={handleRibuan(setSarjana)} placeholder="0" />
        <InputGoogle name="pascasarjana" label="Pascasarjana" value={pascasarjana} onChange={handleRibuan(setPascasarjana)} placeholder="0" />
      </div>

      <SectionLabel>Pekerjaan</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <InputGoogle name="farmer" label="Petani" value={farmer} onChange={handleRibuan(setFarmer)} placeholder="0" />
        <InputGoogle name="entrepreneur" label="Wiraswasta" value={entrepreneur} onChange={handleRibuan(setEntrepreneur)} placeholder="0" />
        <InputGoogle name="employee" label="Pegawai" value={employee} onChange={handleRibuan(setEmployee)} placeholder="0" />
        <InputGoogle name="government" label="PNS/TNI/Polri" value={government} onChange={handleRibuan(setGovernment)} placeholder="0" />
        <InputGoogle name="student" label="Pelajar/Mahasiswa" value={student} onChange={handleRibuan(setStudent)} placeholder="0" />
        <InputGoogle name="pekerjaanlain" label="Lainnya" value={pekerjaanLain} onChange={handleRibuan(setPekerjaanLain)} placeholder="0" />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-5 py-2 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50">
          <FaTimes className="w-4 h-4 inline mr-2" />Batal
        </button>
        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50">
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}