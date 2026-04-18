export const formatRupees = (value: number) => {
    return `Rs. ${new Intl.NumberFormat('en-IN').format(value)}`;
};
