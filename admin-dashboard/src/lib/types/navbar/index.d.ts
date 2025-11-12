type NavbarVariant  = 'link' | 'header'

type NavbarItem = {
    type: NavbarVariant;
    label: string;
    icon?: IconType;
    path?: string;
    count?: number;
}