// project
import { toPascalCase } from '@/helpers';

// library
import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';

export type IconName = keyof typeof SolidIcons | keyof typeof OutlineIcons;

interface Props {
	icon: IconName;
	className?: string;
	outline?: boolean;
}

const Heroicons = (props: Props): JSX.Element => {
	const { icon, className = 'h-5 w-5', outline = false } = props;
	const formattedName = (toPascalCase(icon) + 'Icon') as IconName;
	const Icon = outline ? OutlineIcons[formattedName] : SolidIcons[formattedName];

	return <Icon className={className} />;
};

export default Heroicons;
