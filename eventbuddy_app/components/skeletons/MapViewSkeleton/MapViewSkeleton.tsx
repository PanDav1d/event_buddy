import { View } from "react-native";
import { SkeletonStyle } from "../Skeleton.style";
import { MapViewSkeletonStyle } from "./MapViewSkeleton.style";

export function MapViewSkeleton() {
    const styles = MapViewSkeletonStyle();
    const skeletonStyles = SkeletonStyle()
    return (
        <View style={[skeletonStyles.container, styles.placeholder]} />
    );
}
