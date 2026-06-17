"use client";

import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";

export default function ChpPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        position: "",
        telephone: "",
        email: "",
        website: "",
        productRange: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.company || !formData.email) {
            setErrorMessage("请填写所有必填项（姓名、公司名称、邮箱）。");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: `Partnership Application (CN):
Company: ${formData.company}
Position: ${formData.position}
Telephone: ${formData.telephone}
Website: ${formData.website}
Product Range: ${formData.productRange}
                    `
                })
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMessage("发生错误，请重试。");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("网络错误，请稍后再试。");
        }
    };

    return (
        <AppLayout>
            <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-white break-words">
                <div className="mb-12 md:mb-16 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight text-blue-500 leading-tight">
                        创始级技术合作伙伴计划
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 font-light mb-8 md:mb-10 px-2 md:px-0">
                        与全球最先进的机器人、智能设备与新能源企业共同构建主权计算网络
                    </p>
                    
                    <div className="w-full max-w-full md:max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-800">
                        <img 
                            src="/machinefi-topology.png" 
                            alt="MachineFi Topology" 
                            className="w-full h-auto max-w-full object-contain"
                        />
                    </div>
                </div>

                <div className="space-y-8 md:space-y-12">
                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">创始级技术合作伙伴概述</h2>
                        <div className="space-y-4 md:space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>
                                创始级技术合作伙伴（Founder‑Tech Partners）是全球最领先的硬件制造商，他们的设备已经内置强大的 CPU、GPU、ARM 控制器或嵌入式 Linux 系统。这些设备——机器人、充电桩、智能家电、工业车辆——都拥有大量闲置的计算能力。Wnode 将这些闲置算力转化为可产生收益的节点，为制造商及其客户创造全新的收入来源。
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">为什么我们需要这些合作伙伴</h2>
                        <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>根据我们对中国企业的技术分析，这些公司普遍具备以下优势：</p>
                            <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                <li>高性能 ARM Cortex‑A 处理器</li>
                                <li>开放式嵌入式 Linux 系统，可运行第三方容器</li>
                                <li>持续供电与稳定网络连接</li>
                                <li>大规模设备部署量，形成天然的边缘计算网络</li>
                            </ul>
                            <p className="pt-2">这些特性使他们成为 Wnode 主权计算网络的理想创始级合作伙伴。</p>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">为什么与Wnode合作既简单又免费</h2>
                        <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>Wnode 不需要任何硬件修改、固件修改或工程投入。合作伙伴只需允许 Wnode 在其现有的 Linux 控制器上部署一个安全的沙盒容器。</p>
                            <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                <li>无成本</li>
                                <li>无工程负担</li>
                                <li>不影响安全系统</li>
                                <li>不影响现有产品线</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">环境与经济效益</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm md:text-base text-slate-300 leading-relaxed">
                            <div>
                                <p className="mb-3 md:mb-4 text-slate-200"><strong>Wnode 能够减少：</strong></p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                    <li>电子垃圾</li>
                                    <li>垃圾填埋压力</li>
                                    <li>新建数据中心的需求</li>
                                    <li>闲置硬件的能源浪费</li>
                                </ul>
                            </div>
                            <div>
                                <p className="mb-3 md:mb-4 text-slate-200"><strong>并提升：</strong></p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                    <li>设备寿命</li>
                                    <li>客户投资回报</li>
                                    <li>制造商收益</li>
                                    <li>全球算力供给</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">我们希望合作的原因</h2>
                        <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>我们希望与这些中国企业合作，因为：</p>
                            <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                <li>他们的设备已经具备强大的计算能力</li>
                                <li>他们的产品部署量巨大</li>
                                <li>他们的系统开放、可扩展、可容器化</li>
                                <li>他们的行业影响力能够快速扩大 Wnode 的全球覆盖</li>
                                <li>他们的客户群体将直接受益于 Wnode 的收益模型</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">新收益渠道</h2>
                        <div className="space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-2">1. 自主机器算力收益</h3>
                                <p>设备在闲置时自动运行去中心化计算任务，形成终身持续的算力收益，无需人工干预。</p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-2">2. M2M 高速结算收益</h3>
                                <p>通过机器与机器之间的实时支付网络，设备可在毫秒级完成任务结算，形成高速增长的收益流。</p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-2">3. 边缘虚拟化托管收益</h3>
                                <p>设备作为本地微型数据中心，为企业、家庭和工业客户提供安全的边缘计算托管服务。</p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-2">4. 长期不可篡改的算力资产增值</h3>
                                <p>每台设备在 Wnode 网络中形成一个永久存在的算力资产，随着网络规模增长而自动升值。</p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-2">5. 绿色节能算力回收收益</h3>
                                <p>通过利用闲置硬件算力，减少对新数据中心的需求，设备可获得绿色算力补贴与生态收益。</p>
                            </div>
                            <div className="pt-4 mt-6 border-t border-slate-800">
                                <p className="text-lg md:text-xl font-medium text-blue-300 italic">
                                    “为科技注入新生命，让每一台设备成为可持续增长的收益资产。”
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-blue-600/20 border border-blue-500/50 rounded-2xl p-6 md:p-10 text-center hover:bg-blue-600/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">行动呼吁</h2>
                        <p className="text-base md:text-xl text-blue-200 mb-6 md:mb-8">
                            加入 Wnode 创始级技术合作伙伴计划，让您的设备在全球范围内创造持续收益。
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-full transition-colors shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                        >
                            与我们交流
                        </button>
                    </section>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-black/90 md:bg-black/80 backdrop-blur-sm pt-[10vh] md:pt-0 px-0 md:px-4">
                    <div className="bg-slate-900 border-t border-slate-800 md:border md:rounded-2xl p-6 md:p-8 w-full md:max-w-lg relative h-[90vh] md:h-auto overflow-y-auto rounded-t-2xl md:rounded-2xl">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
                        >
                            ✕
                        </button>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 pr-8">合作申请表</h3>
                        
                        {status === "success" ? (
                            <div className="text-center py-12 md:py-10">
                                <div className="text-5xl md:text-4xl mb-4">✅</div>
                                <p className="text-lg md:text-xl text-white font-medium leading-relaxed">您的申请已成功提交，我们会尽快与您联系。</p>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full md:w-auto mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-colors"
                                >
                                    关闭
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 pb-8 md:pb-0">
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">姓名 *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 md:py-2.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">公司名称 *</label>
                                    <input 
                                        type="text" 
                                        name="company" 
                                        value={formData.company} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 md:py-2.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">职位</label>
                                    <input 
                                        type="text" 
                                        name="position" 
                                        value={formData.position} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 md:py-2.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">电话</label>
                                    <input 
                                        type="tel" 
                                        name="telephone" 
                                        value={formData.telephone} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 md:py-2.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">邮箱 *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 md:py-2.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">网站</label>
                                    <input 
                                        type="url" 
                                        name="website" 
                                        value={formData.website} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 md:py-2.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium text-slate-300 mb-1.5">产品范围</label>
                                    <textarea 
                                        name="productRange" 
                                        value={formData.productRange} 
                                        onChange={handleInputChange} 
                                        rows={4}
                                        className="w-full bg-slate-950 border border-slate-700 md:border-slate-800 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-blue-500 resize-none transition-colors"
                                    ></textarea>
                                </div>

                                {errorMessage && (
                                    <div className="text-red-500 text-sm md:text-base font-medium">{errorMessage}</div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={status === "loading"}
                                    className="w-full mt-6 md:mt-8 px-6 py-4 md:py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold text-lg md:text-base rounded-lg transition-colors"
                                >
                                    {status === "loading" ? "提交中..." : "提交申请"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
