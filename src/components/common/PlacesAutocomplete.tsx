"use client";

import { useState } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";


export default function StreetAutocomplete({ formData, setFormData }: any) {
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
    const [error, setError] = useState<string>("");
    const onLoad = (ref: google.maps.places.SearchBox) => {
        setSearchBox(ref);
    };

    const onPlacesChanged = () => {
        if (!searchBox) return;

        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];
        console.log(place);

        const formatted_address = places[0]?.formatted_address;
        if (!place.address_components) return;

        let street = "";
        let suburb = "";
        let state = "";
        let postCode = "";
        let postalCode = "";

        place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number")) {
                street = component.long_name + " " + street;
            }
            if (types.includes("route")) {
                street += component.long_name;
            }
            if (types.includes("locality")) {
                suburb = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
                state = component.long_name;
            }
            if (types.includes("postal_code")) {
                postCode = component.long_name;
                postalCode = component.long_name;
            }
        });

        // ✅ fallback to formatted_address if no street was found
        if (!street) {
            street += formatted_address;
        }

        setFormData((prev: any) => ({
            ...prev,
            address: {
                street,
                suburb,
                state,
                postCode,
                postalCode,
                locationUrl: place.place_id
                    ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
                    : place?.url,
            },
        }));
    };

    return (

        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
            <input
                type="text"
                placeholder="Enter street"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none 
          ${error ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`}
                value={formData.address.street}
                onChange={(e) =>
                    setFormData((prev: any) => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value },
                    }))
                }
            />
        </StandaloneSearchBox>
    );
}
