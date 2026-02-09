import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    // Custom URL encoding function for categories
    const encodeCategoryForURL = (category) => {
        // Replace / with , and space
        return encodeURIComponent(category.replace(/\//g, ', '));
    };

    const handleFooterCourseClick = (course) => {
        navigate(`/view-all-courses?category=${encodeCategoryForURL(course)}`);
    };

    return (
        <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                        <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                            About Biology.Trunk
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            India's premier online learning platform providing quality education
                            led by Ph.D. experts, NET & GATE qualified faculty with 15+ years
                            of government college teaching experience.
                        </p>
                        <div className="flex gap-2 sm:gap-3 mt-2">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <i className="fab fa-facebook text-sm"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <i className="fab fa-twitter text-sm"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <i className="fab fa-linkedin text-sm"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <i className="fab fa-instagram text-sm"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                            Courses
                        </h4>
                        <ul className="text-xs space-y-1.5">
                            {[
                                "Class 11",
                                "Class 12",
                                "TGT, PGT",
                            ].map((item) => (
                                <li key={item}>
                                    <div
                                        onClick={() => handleFooterCourseClick(item)}
                                        className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <i className="fas fa-chevron-right text-xs"></i>
                                        {item}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                            Faculty Credentials
                        </h4>
                        <ul className="text-xs space-y-1.5">
                            {[
                                "Ph.D. Holders",
                                "NET & GATE Qualified",
                                "15+ Years Experience",
                                "IIT/NIT Alumni",
                                "Subject Matter Experts",
                            ].map((item) => (
                                <li key={item}>
                                    <div className="text-gray-400 flex items-center gap-1">
                                        <i className="fas fa-check text-green-500 text-xs"></i>
                                        {item}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                            Legal
                        </h4>
                        <ul className="text-xs space-y-1.5">
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                >
                                    <i className="fas fa-chevron-right text-xs"></i>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms-conditions"
                                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                >
                                    <i className="fas fa-chevron-right text-xs"></i>
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/refund-policy"
                                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                >
                                    <i className="fas fa-chevron-right text-xs"></i>
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                >
                                    <i className="fas fa-chevron-right text-xs"></i>
                                    Contact Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-4 text-center">
                    <p className="text-xs text-gray-400">
                        <i className="fas fa-copyright mr-1"></i>
                        2025 Biology.Trunk. All rights reserved. | Excellence in Education
                        through Expert Guidance
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
