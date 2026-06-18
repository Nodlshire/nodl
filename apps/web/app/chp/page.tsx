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
                </div>

                <div className="space-y-8 md:space-y-12">
                    
                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">Wnode：机器经济的互操作路由器（Machine‑Economy Router）</h2>
                        <div className="space-y-4 md:space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>全球企业正加速迈向自动化，但现实是：<br/>计算在一个系统里，支付在另一个系统里，存储在第三个系统里，流动性散落在不同链上，数据分布在无数平台中。<br/>一切都是割裂的，没有任何系统真正互通。</p>
                            
                            <p className="font-bold text-blue-300 text-lg">Wnode 解决这一切。</p>
                            
                            <p>Wnode 是一个主权计算网络（Sovereign Compute Mesh），让自主智能体（Agents）能够在同一执行层中完成：</p>
                            <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                <li>运行计算任务</li>
                                <li>跨境流动性路由</li>
                                <li>稳定币与法币结算</li>
                                <li>挂载瞬时 POSIX 存储</li>
                                <li>访问真实世界数据</li>
                                <li>与任意链、任意支付轨道交互</li>
                            </ul>
                            <div className="pt-4 text-blue-300 font-medium space-y-1">
                                <p>我们不是链。</p>
                                <p>我们不是云。</p>
                                <p>我们是连接所有系统的“路由器”。</p>
                            </div>
                        </div>
                    </section>

                    <div className="w-full max-w-full md:max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-800 my-12">
                        <img 
                            src="/machinefi-topology.png" 
                            alt="MachineFi Topology" 
                            className="w-full h-auto max-w-full object-contain"
                        />
                    </div>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">创始级技术合作伙伴概述</h2>
                        <div className="space-y-4 md:space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>
                                创始级技术合作伙伴（Founder‑Tech Partners）是全球最领先的硬件制造商，他们的设备已经内置强大的 CPU、GPU、ARM 控制器或嵌入式 Linux 系统。这些设备——机器人、充电桩、智能家电、工业车辆——都拥有大量闲置的计算能力。Wnode 将这些闲置算力转化为可产生收益的节点，为制造商及其客户创造全新的收入来源，并让这些设备成为机器经济中的基础算力单元。
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
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">为什么与 Wnode 合作既简单又免费</h2>
                        <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>Wnode 不需要任何硬件修改、固件修改或工程投入。合作伙伴只需允许 Wnode 在其现有的 Linux 控制器上部署一个安全的沙盒容器。</p>
                            <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                <li>无成本</li>
                                <li>无工程负担</li>
                                <li>不影响安全系统</li>
                                <li>不影响现有产品线</li>
                            </ul>
                            <p className="pt-4">同时，Wnode 的架构是完全无状态、无托管、无风险的：</p>
                            <p>Wnode 永不保存：</p>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1 text-slate-400">
                                <li>私钥</li>
                                <li>用户余额</li>
                                <li>托管资产</li>
                                <li>长期凭证</li>
                                <li>日志</li>
                                <li>合规数据</li>
                            </ul>
                            <p className="pt-4">
                                所有执行均在内存中完成，并在任务结束后立即清除。<br/>
                                这意味着零监管风险、零安全负担、零攻击面扩张。
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-blue-400">Wnode 为合作伙伴带来的价值</h2>
                        <div className="space-y-8 text-sm md:text-base text-slate-300 leading-relaxed">
                            
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-3">1. 全新的机器驱动交易量（Machine‑Driven Volume）</h3>
                                <p className="mb-3">Wnode 的自主智能体会持续产生高频交易量，包括：</p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-1 text-slate-400 mb-4 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                    <li>计算任务执行</li>
                                    <li>跨境结算</li>
                                    <li>Token 化与资产发行</li>
                                    <li>流动性路由</li>
                                    <li>MPC 托管与资金调度</li>
                                    <li>稳定币 ↔ 法币转换</li>
                                    <li>存储读写</li>
                                    <li>数据采集与处理</li>
                                </ul>
                                <p>
                                    这些交易量不依赖用户、不依赖人工、不依赖前端。<br/>
                                    它们 24/7 自动运行，无停机、无周末、无人工延迟。
                                </p>
                            </div>

                            <div className="border-t border-slate-800 pt-6">
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-3">2. 一次接入，加入全球跨链跨轨道执行网络</h3>
                                <p className="mb-3">当合作伙伴接入 Wnode，不仅仅是接入我们——<br/>而是接入我们已经整合的所有全球基础设施：</p>
                                <ul className="list-none space-y-1 text-slate-400 mb-4 grid grid-cols-2 md:grid-cols-3 gap-x-4">
                                    <li>Ripple</li>
                                    <li>Bitso</li>
                                    <li>Flutterwave</li>
                                    <li>Fireblocks</li>
                                    <li>Base</li>
                                    <li>Polygon</li>
                                    <li>Filecoin</li>
                                    <li>ZeroFS</li>
                                    <li>Helium</li>
                                    <li>Bluefin</li>
                                    <li>Mintlayer</li>
                                </ul>
                                <p className="text-slate-400 mb-4">以及更多正在加入的全球网络</p>
                                <p>
                                    合作伙伴的设备与系统将自动成为全球跨链、跨支付轨道、跨数据源的执行节点。
                                </p>
                            </div>

                            <div className="border-t border-slate-800 pt-6">
                                <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-3">3. 无需改变任何现有系统，却能获得更高价值</h3>
                                <p className="mb-3">合作伙伴无需：</p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-1 text-slate-400 mb-4">
                                    <li>修改硬件</li>
                                    <li>修改固件</li>
                                    <li>修改 API</li>
                                    <li>修改产品架构</li>
                                </ul>
                                <p className="mb-3">Wnode 的智能体会自动使用合作伙伴现有的能力来：</p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-1 text-slate-400 mb-4 grid grid-cols-2 gap-x-4">
                                    <li>结算</li>
                                    <li>路由</li>
                                    <li>计算</li>
                                    <li>存储</li>
                                    <li>签名</li>
                                    <li>执行</li>
                                </ul>
                                <p>
                                    合作伙伴获得新的使用量、新的分发渠道、新的收益来源，且零工程投入。
                                </p>
                            </div>

                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">环境与经济效益</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm md:text-base text-slate-300 leading-relaxed">
                            <div>
                                <p className="mb-3 md:mb-4">Wnode 能够减少：</p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                    <li>电子垃圾</li>
                                    <li>垃圾填埋压力</li>
                                    <li>新建数据中心的需求</li>
                                    <li>闲置硬件的能源浪费</li>
                                </ul>
                            </div>
                            <div>
                                <p className="mb-3 md:mb-4">并提升：</p>
                                <ul className="list-disc pl-5 md:pl-6 space-y-2 text-slate-400">
                                    <li>设备寿命</li>
                                    <li>客户投资回报</li>
                                    <li>制造商收益</li>
                                    <li>全球算力供给</li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 mt-6 border-t border-slate-800">
                            <p className="text-lg md:text-xl font-medium text-blue-300 italic text-center">
                                “为科技注入新生命，让每一台设备成为可持续增长的收益资产。”
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-400">我们希望合作的原因</h2>
                        <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed">
                            <p>我们希望与中国企业合作，因为：</p>
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
                            <ul className="list-none space-y-4 text-slate-200">
                                <li>1. 自主机器算力收益</li>
                                <li>2. M2M 高速结算收益</li>
                                <li>3. 边缘虚拟化托管收益</li>
                                <li>4. 长期不可篡改的算力资产增值</li>
                                <li>5. 绿色节能算力回收收益</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-blue-600/20 border border-blue-500/50 rounded-2xl p-6 md:p-10 text-center hover:bg-blue-600/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">行动呼吁</h2>
                        <p className="text-base md:text-xl text-blue-200 mb-6 md:mb-8 leading-relaxed">
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
                    <div className="bg-slate-900 border-t border-slate-800 md:border md:rounded-2xl p-6 md:p-8 w-full md:max-w-lg relative h-[90vh] md:h-auto overflow-y-auto rounded-t-2xl md:rounded-2xl shadow-2xl">
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
